import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Request } from 'express';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { IpnUnknownError, VerifyReturnUrl } from 'vnpay';
import { Public } from 'src/auth/decorators/public.decorator';
import { RawResponse } from 'src/common/decorators/raw-response.decorator';
import { FindAllDto } from 'src/modules/payment/dto/find-all-dto';
import { AdminGuard } from 'src/common/guards/admin.guard';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // Helper
  getClientIp(req: Request): string {
    const xForwardedFor = req.headers['x-forwarded-for'];
    if (typeof xForwardedFor === 'string') {
      return xForwardedFor.split(',')[0].trim();
    }
    return req.socket.remoteAddress || '';
  }

  @Get()
  genPaymentUrl(@Req() req: Request, @GetUser('sub') userId: string) {
    const ip = this.getClientIp(req);
    return this.paymentService.genPaymentUrl(ip, userId);
  }

  @Public()
  @RawResponse()
  @Get('vnpay-ipn')
  async handleIpn(@Req() req: Request) {
    try {
      const verify: VerifyReturnUrl = this.paymentService.verifyIpn(req.query);
      const response = await this.paymentService.handleVnpayIpn(verify); // tách logic nghiệp vụ
      return response;
    } catch {
      return IpnUnknownError;
    }
  }

  @Post('vnpay/verify')
  async verifyVnpayReturn(@Body() body: Record<string, any>) {
    return this.paymentService.verifyIpn(body);
  }

  @Post('find-all')
  @UseGuards(AdminGuard)
  findAll(@Body() findAllDto: FindAllDto) {
    return this.paymentService.findAll(findAllDto);
  }

  @UseGuards(AdminGuard)
  @Get('find-by-user-id/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.paymentService.findByUserId(userId);
  }

  @UseGuards(AdminGuard)
  @Get('statistic/:year')
  statistic(@Param('year') year: string) {
    return this.paymentService.statistic(+year);
  }
}
