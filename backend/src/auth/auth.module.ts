import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from 'src/auth/strategies/local.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { RefreshTokenStrategy } from 'src/auth/strategies/refresh-token.strategy';
import { UsersService } from 'src/modules/users/users.service';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [
    // JwtModule.registerAsync({
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => ({
    //     secret: config.get<string>('JWT_ACCESS_SECRET'),
    //     signOptions: { expiresIn: config.get<string>('JWT_ACCESS_EXPIRES_IN') },
    //   }),
    // }),
    JwtModule.register({}),
    PassportModule,
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
