import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class ArtDto {
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
  artist?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  program?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  donation_link?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  guided_tours?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  self_guided_tour_map?: number;

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
  @IsNumber()
  @IsOptional()
  locationId?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  thumbnail_url?: string;
}
