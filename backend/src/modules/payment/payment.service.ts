import { BadRequestException, Injectable } from '@nestjs/common';
import {
  HashAlgorithm,
  InpOrderAlreadyConfirmed,
  IpnFailChecksum,
  IpnInvalidAmount,
  IpnOrderNotFound,
  IpnSuccess,
  IpnUnknownError,
  ProductCode,
  VNPay,
  VerifyReturnUrl,
  VnpLocale,
  consoleLogger,
  dateFormat,
  ignoreLogger,
} from 'vnpay';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderStatus } from 'src/modules/payment/entities/order.entity';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { UsersService } from 'src/modules/users/users.service';
import { UserType } from 'src/modules/users/entities/user.entity';
import { UsageService } from 'src/modules/usage/usage.service';
import { FindAllDto } from 'src/modules/payment/dto/find-all-dto';
import { createPaginationResult } from 'src/common/interfaces/pagination-result.interface';

@Injectable()
export class PaymentService {
  private readonly vnpay = new VNPay({
    tmnCode: this.configService.get('VNP_TMNCODE'),
    secureSecret: this.configService.get('VNP_SECRET'),
    vnpayHost: 'https://sandbox.vnpayment.vn',

    testMode: true,
    hashAlgorithm: HashAlgorithm.SHA512,
    enableLog: true,
    loggerFn: ignoreLogger,

    endpoints: {
      paymentEndpoint: 'paymentv2/vpcpay.html',
      queryDrRefundEndpoint: 'merchant_webapi/api/transaction',
      getBankListEndpoint: 'qrpayauth/api/merchant/get_bank_list',
    },
  });
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private readonly usersService: UsersService,
    private readonly usageService: UsageService,
  ) {}
  async genPaymentUrl(ip: string, userId: string) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const order = await this.create(userId);
    try {
      const paymentUrl = this.vnpay.buildPaymentUrl(
        {
          vnp_Amount: 10000,
          vnp_IpAddr: ip,
          vnp_TxnRef: order.id,
          vnp_OrderInfo: `Thanh toan don hang ${order.id}`,
          vnp_OrderType: ProductCode.Other,
          vnp_ReturnUrl: `${this.configService.get('FRONT_END_HOST')}:${this.configService.get('FRONT_END_PORT')}/vnpay-return`,
          vnp_Locale: VnpLocale.VN,
          vnp_CreateDate: dateFormat(new Date()),
          vnp_ExpireDate: dateFormat(tomorrow),
        },
        {
          logger: {
            type: 'all',
            loggerFn: consoleLogger,
          },
        },
      );

      return { paymentUrl };
    } catch {
      throw new BadRequestException('Failed to create order');
    }
  }

  async create(userId: string) {
    const price = parseInt(this.configService.get('PRO_PLAN_PRICE'), 10);
    return await this.orderRepository.save({
      userId,
      amount: price,
    });
  }

  verifyIpn(query) {
    return this.vnpay.verifyIpnCall(query);
  }

  async handleVnpayIpn(verify: VerifyReturnUrl) {
    if (!verify.isVerified) return IpnFailChecksum;
    if (!verify.isSuccess) return IpnUnknownError;

    const order = await this.findByTxnRef(verify.vnp_TxnRef);
    if (!order) return IpnOrderNotFound;
    if (verify.vnp_Amount !== order.amount) return IpnInvalidAmount;
    if (order.status === 'completed') return InpOrderAlreadyConfirmed;

    order.status = OrderStatus.Completed;
    await this.orderRepository.save(order);
    const user = await this.usersService.findById(order.userId);

    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    user.userType = UserType.ENTERPRISE;
    user.enterpriseExpiresAt = nextMonth;
    await this.usersService.update(user.id, user);
    await this.usageService.resetUserPoint(user.id);

    return IpnSuccess;
  }

  async findByTxnRef(id: string) {
    return await this.orderRepository.findOneBy({ id });
  }

  async findAll(findAllDto: FindAllDto) {
    const { from, to, offset, pageSize, pageNumber } = findAllDto;

    const where: any = {};

    if (from && to) {
      where.createdAt = Between(from, to);
    } else if (from) {
      where.createdAt = MoreThanOrEqual(from);
    } else if (to) {
      where.createdAt = LessThanOrEqual(to);
    }

    const [items, count] = await this.orderRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      relations: ['user'],
      take: pageSize,
      skip: offset,
    });

    return createPaginationResult(items, {
      total: count,
      pageNumber: pageNumber,
      pageSize: pageSize,
    });
  }

  async statistic(year: number) {
    const start = new Date(year, 0, 1);
    const end = new Date(year + 1, 0, 1);
    const invoices = await this.orderRepository.findBy({
      createdAt: Between(start, end),
      status: OrderStatus.Completed,
    });
    const total = invoices.reduce((sum, item) => sum + item.amount / 1000, 0);
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const monthlyTotals = monthNames.map((name) => ({
      month: name,
      total: 0,
    }));

    invoices.forEach((item) => {
      const month = item.createdAt.getMonth();
      monthlyTotals[month].total += item.amount / 1000;
    });

    const previousTotal = await this.getTotalRevenue(year - 1);
    const growthRate =
      previousTotal > 0
        ? Math.abs(((total - previousTotal) / previousTotal) * 100)
        : 0;
    const growthStatus = growthRate >= 0 ? 'increase' : 'decrease';

    return { total, monthlyTotals, growthRate, growthStatus };
  }

  async getTotalRevenue(year: number) {
    const start = new Date(year, 0, 1);
    const end = new Date(year + 1, 0, 1);
    const invoices = await this.orderRepository.findBy({
      createdAt: Between(start, end),
      status: OrderStatus.Completed,
    });
    const total = invoices.reduce((sum, item) => sum + item.amount / 1000, 0);
    return total;
  }

  async findByUserId(userId: string) {
    return await this.orderRepository.findBy({ userId });
  }
}
