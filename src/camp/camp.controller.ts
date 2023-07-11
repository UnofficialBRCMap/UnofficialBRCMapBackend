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
  // UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Camp } from '@prisma/client';
// import { JwtGuard } from '../auth/guard';
import { CampService } from './camp.service';
import { CampDto, CampEntity, LocationDto } from './dto';
import { IResponse } from '../common/interfaces/response.interface';

// @UseGuards(JwtGuard)
@ApiTags('Camps')
@Controller('camps')
export class CampController {
  constructor(private campService: CampService) {}

  @Get()
  async getCamps(): Promise<CampEntity[]> {
    const Camps = await this.campService.getCamps();
    return Camps.map((Camp: Camp) => new CampEntity(Camp));
  }

  @Get(':campId')
  async getCampById(@Param('campId') CampId: string): Promise<CampEntity> {
    return new CampEntity(await this.campService.getCampById(CampId));
  }

  @Post()
  async createCamp(@Body() dto: CampDto): Promise<CampEntity> {
    return new CampEntity(await this.campService.createCamp(dto));
  }

  @Patch(':campId')
  async editCampById(
    @Param('campId') CampId: string,
    @Body() dto: CampDto,
  ): Promise<CampEntity> {
    return new CampEntity(await this.campService.editCampById(CampId, dto));
  }

  // Allows you to patch the camp location of a single camp
  @Patch(':campId/location')
  async editCampLocationById(
    @Param('campId') CampId: string,
    @Body() dto: LocationDto,
  ): Promise<CampEntity> {
    return new CampEntity(await this.campService.editCampLocation(CampId, dto));
  }

  @HttpCode(HttpStatus.OK)
  @Get('brc_data/:year')
  async getRemoteCamps(@Param('year') year: string): Promise<IResponse> {
    return await this.campService.getRemoteCamps(year);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':campId')
  deleteCampById(@Param('campId') CampId: string) {
    return this.campService.deleteCampById(CampId);
  }
}
