import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class LocationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  uid: string;

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
  @IsOptional()
  string: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  frontage: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  intersection: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  intersection_type: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  dimensions: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  hour: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  minute: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  distance: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  category: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  gps_latitude: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  gps_longitude: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  campId: string;
}
