import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbOptions, load } from 'src/config/db.config';
import { UsersModule } from 'src/modules/users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ChatModule } from 'src/modules/chat/chat.module';
import { IsExistConstraint } from 'src/common/validators/is-exist-constraint.validator';
import { DownloadModule } from 'src/modules/download/download.module';
import { UsageModule } from 'src/modules/usage/usage.module';
import { ScheduleModule } from '@nestjs/schedule';
import { HelpCenterModule } from 'src/modules/help-center/help-center.module';
import { PaymentModule } from 'src/modules/payment/payment.module';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: '.env.development.local',
      isGlobal: true,
      load: [load],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: dbOptions,
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    ChatModule,
    DownloadModule,
    UsageModule,
    HelpCenterModule,
    PaymentModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    IsExistConstraint,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
