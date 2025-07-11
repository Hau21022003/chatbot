import { IsOptional, IsString } from "class-validator";

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;
}

export class UpdatePasswordDto {
  @IsString()
  @IsOptional()
  currentPassword: string;

  @IsString()
  @IsOptional()
  newPassword: string;
}
