import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Camp } from '@prisma/client';
import { JwtGuard } from '../auth/guard';
import { CampService } from './camp.service';
import { CampDto, CampEntity } from './dto';

@UseGuards(JwtGuard)
@ApiTags('Camps')
@Controller('camps')
export class CampController {
  constructor(private campService: CampService) {}

  @Get()
  async getCamps(): Promise<CampEntity[]> {
    const Camps = await this.campService.getCamps();
    return Camps.map((Camp: Camp) => new CampEntity(Camp));
  }

  @Get(':CampId')
  async getCampById(@Param('CampId') CampId: string): Promise<CampEntity> {
    return new CampEntity(await this.campService.getCampById(CampId));
  }

  @Post()
  async createCamp(@Body() dto: CampDto): Promise<CampEntity> {
    return new CampEntity(await this.campService.createCamp(dto));
  }

  @Patch(':CampId')
  async editCampById(
    @Param('CampId') CampId: string,
    @Body() dto: CampDto,
  ): Promise<CampEntity> {
    return new CampEntity(await this.campService.editCampById(CampId, dto));
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':CampId')
  deleteCampById(@Param('CampId') CampId: string) {
    return this.campService.deleteCampById(CampId);
  }
}
