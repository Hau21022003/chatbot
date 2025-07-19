import { Controller, Get, Req, Query, Res } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Request, Response } from 'express';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { IpnUnknownError, VerifyReturnUrl } from 'vnpay';
import { Public } from 'src/auth/decorators/public.decorator';

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
  @Get('vnpay-ipn')
  async handleIpn(@Query() query, @Res() res: Response) {
    console.log('vnpay-ipn');
    try {
      const verify: VerifyReturnUrl = this.paymentService.verifyIpn(query);
      const response = await this.paymentService.handleVnpayIpn(verify); // tách logic nghiệp vụ

      return res.json(response);
    } catch (error) {
      console.error(error);
      return res.json(IpnUnknownError);
    }
  }
}
