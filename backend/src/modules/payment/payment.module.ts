import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/modules/payment/entities/order.entity';
import { UsersModule } from 'src/modules/users/users.module';
import { UsageModule } from 'src/modules/usage/usage.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), UsersModule, UsageModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
