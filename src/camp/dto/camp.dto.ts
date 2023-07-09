import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CampDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  updatedAt: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  year: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  website?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  url?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  contact_email?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  hometown?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  location_string?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  locationId?: number;
}
