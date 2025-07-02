import { Module } from '@nestjs/common';
import { UsageService } from './usage.service';
import { UsageController } from './usage.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserUsage } from 'src/modules/usage/entities/user-usage.entity';
import { UsersModule } from 'src/modules/users/users.module';
import { User } from 'src/modules/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserUsage]), UsersModule],
  controllers: [UsageController],
  providers: [UsageService],
  exports: [UsageService],
})
export class UsageModule {}
