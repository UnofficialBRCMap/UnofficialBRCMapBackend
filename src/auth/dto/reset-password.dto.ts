import { IsEmail, IsOptional, IsString } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail()
  email: string;

  @IsString()
  newPassword: string;

  @IsOptional()
  @IsString()
  newPasswordToken: string;

  @IsOptional()
  @IsString()
  currentPassword: string;
}
