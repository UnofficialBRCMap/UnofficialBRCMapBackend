import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @ApiProperty({
    default: 'email@email.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  phone: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  token?: string;
}
