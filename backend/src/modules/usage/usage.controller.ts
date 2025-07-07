import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsageService } from './usage.service';
import { StatisticDto } from 'src/modules/usage/dto/statistic.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';

@Controller('usage')
export class UsageController {
  constructor(private readonly usageService: UsageService) {}

  @Post('statistic')
  statistic(@Body() dto: StatisticDto, @GetUser('sub') userId: string) {
    return this.usageService.statistic(userId, dto);
  }
}
