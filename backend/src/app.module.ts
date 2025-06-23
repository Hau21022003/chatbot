import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbOptions, load } from 'src/config/db.config';
import { UsersModule } from 'src/modules/users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ChatModule } from 'src/modules/chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.development.env',
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
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
