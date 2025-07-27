import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { UserType } from 'src/modules/users/entities/user.entity';

export enum UserStatus {
  ALL = 'all',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export class FindAllDto extends PaginationDto {
  @IsOptional()
  @IsEnum(UserType)
  userType: UserType;

  @IsOptional()
  @IsEnum(UserStatus)
  userStatus: UserStatus;

  @IsOptional()
  @IsString()
  searchQuery: string;
}
