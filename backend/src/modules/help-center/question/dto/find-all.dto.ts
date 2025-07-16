import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class FindAllDto extends PaginationDto {
  @IsOptional()
  @IsString()
  searchQuery?: string;

  @IsOptional()
  @IsEnum(['most recent', 'most useful'])
  sortBy: 'most recent' | 'most useful';

  @IsOptional()
  @IsEnum(['all', 'my post', 'pinned', 'others'])
  type?: 'all' | 'my post' | 'pinned' | 'others';
}
