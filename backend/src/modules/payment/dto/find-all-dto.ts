import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class FindAllDto extends PaginationDto {
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  from?: Date;

  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  to?: Date;

  // @IsOptional()
  // @IsString()
  // searchQuery?: string;
}
