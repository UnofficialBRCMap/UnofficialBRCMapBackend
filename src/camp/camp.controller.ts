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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CampService } from './camp.service';
import { CampDto, CampEntity } from './dto';

@UseGuards(JwtGuard)
@ApiTags('Camps')
@Controller('camps')
export class CampController {
  constructor(private CampService: CampService) {}

  @Get()
  async getCamps(): Promise<CampEntity[]> {
    const Camps = await this.CampService.getCamps();
    return Camps.map((Camp: Camp) => new CampEntity(Camp));
  }

  @Get(':CampId')
  async getCampById(@Param('CampId') CampId: string): Promise<CampEntity> {
    return new CampEntity(await this.CampService.getCampById(CampId));
  }

  @Post()
  async createCamp(@Body() dto: CampDto): Promise<CampEntity> {
    return new CampEntity(await this.CampService.createCamp(dto));
  }

  @Patch(':CampId')
  async editCampById(
    @Param('CampId') CampId: string,
    @Body() dto: CampDto,
  ): Promise<CampEntity> {
    return new CampEntity(await this.CampService.editCampById(CampId, dto));
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':CampId')
  deleteCampById(@Param('CampId') CampId: string) {
    return this.CampService.deleteCampById(CampId);
  }
}
