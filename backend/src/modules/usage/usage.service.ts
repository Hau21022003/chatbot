import { Injectable, Logger } from '@nestjs/common';
import { UserUsage } from 'src/modules/usage/entities/user-usage.entity';
import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserType } from 'src/modules/users/entities/user.entity';
import { UsersService } from 'src/modules/users/users.service';
import { Cron } from '@nestjs/schedule';
import { StatisticDto } from 'src/modules/usage/dto/statistic.dto';
import { config } from 'process';

@Injectable()
export class UsageService {
  private readonly logger = new Logger(UsageService.name);
  private readonly POINTS_CONFIG = {
    [UserType.FREE]: {
      dailyLimit: 100,
      inputTokenRate: 0.01,
      outputTokenRate: 0.02,
    },
    [UserType.ENTERPRISE]: {
      dailyLimit: 1000,
      inputTokenRate: 0.005,
      outputTokenRate: 0.01,
    },
  };

  constructor(
    @InjectRepository(UserUsage)
    private userUsageRepository: Repository<UserUsage>,
    private userService: UsersService,
  ) {}

  async statistic(userId: string, dto: StatisticDto) {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - dto.dateRange);
    const { remainingPoints, userType } =
      await this.userService.findById(userId);
    const userUsages = await this.userUsageRepository.find({
      where: {
        userId: userId,
        date: Between(fromDate, new Date()),
      },
    });
    const dailyPoints = this.POINTS_CONFIG[userType].dailyLimit;
    return {
      dailyPoints,
      remainingPoints,
      userUsages,
    };
  }

  async updateDailyUsage(
    userId: string,
    inputTokens: number,
    outputTokens: number,
  ) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let usage = await this.userUsageRepository.findOne({
      where: { userId: userId, date: today },
    });

    if (!usage) {
      usage = this.userUsageRepository.create({
        userId,
        date: today,
        totalInputTokens: 0,
        totalOutputTokens: 0,
        totalPointsUsed: 0,
        messageCount: 0,
      });
    }

    const user = await this.userService.findById(userId);

    const pointsUsed = this.calcPointsUsed(
      user.userType,
      inputTokens,
      outputTokens,
    );
    await this.updateUserPoints(userId, pointsUsed);
    usage.totalPointsUsed += pointsUsed;
    usage.totalInputTokens += inputTokens;
    usage.totalOutputTokens += outputTokens;
    usage.messageCount += 1;

    await this.userUsageRepository.save(usage);
  }

  private calcPointsUsed(
    userType: UserType,
    inputTokens: number,
    outputTokens: number,
  ) {
    const config = this.POINTS_CONFIG[userType];
    const pointsUsed =
      inputTokens * config.inputTokenRate +
      outputTokens * config.outputTokenRate;
    return pointsUsed;
  }

  private async updateUserPoints(userId: string, pointsUsed: number) {
    const user = await this.userService.findById(userId);
    const newRemainingPoints = Math.max(user.remainingPoints - pointsUsed, 0);
    await this.userService.update(userId, {
      remainingPoints: newRemainingPoints,
    });
  }

  @Cron('0 0 * * *') // chạy lúc 00:00 hằng ngày
  // @Cron('* * * * *')
  async resetUserPoints() {
    try {
      let users = await this.userService.findAll();

      users = users.map((user) => {
        const config = this.POINTS_CONFIG[user.userType];
        if (config) {
          user.remainingPoints = config.dailyLimit;
        }
        return user;
      });

      await this.userService.updateMany(users);
      this.logger.debug(`Đã reset điểm cho ${users.length} người dùng`);
    } catch (error) {
      this.logger.error('Lỗi khi reset user points:', error);
    }
  }
}
