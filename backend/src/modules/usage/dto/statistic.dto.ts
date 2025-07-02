import { Transform } from 'class-transformer';
import { IsIn, IsNotEmpty, IsNumber } from 'class-validator';

export class StatisticDto {
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @IsIn([7, 30])
  dateRange: number;
}
