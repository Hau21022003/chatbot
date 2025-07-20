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
import { Repository } from 'typeorm';
import { UsersService } from 'src/modules/users/users.service';
import { UserType } from 'src/modules/users/entities/user.entity';

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

    return IpnSuccess;
  }

  async findByTxnRef(id: string) {
    return await this.orderRepository.findOneBy({ id });
  }
}
