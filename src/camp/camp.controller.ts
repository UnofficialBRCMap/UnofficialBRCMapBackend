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
// import { JwtGuard } from '../auth/guard';
import { CampService } from './camp.service';
import { CampDto, CampEntity, CampWithLocations } from './dto';
import { LocationDto } from '../location/dto';
import { IResponse } from '../common/interfaces/response.interface';
import { Camp, Location } from '@prisma/client';

// @UseGuards(JwtGuard)
@ApiTags('Camps')
@Controller('camps')
export class CampController {
  constructor(private campService: CampService) {}

  // Returns all camps with locations if any exist
  @Get()
  async getCamps(): Promise<CampEntity[]> {
    const Camps = await this.campService.getCamps();
    return Camps.map((Camp: CampWithLocations) => new CampEntity(Camp));
  }

  // Returns a single camp by its id
  @Get(':campId')
  async getCampById(@Param('campId') CampId: string): Promise<Camp> {
    return await this.campService.getCampById(CampId);
  }

  // Returns a single camp by its name with locations if any exist
  @Get(':campName')
  async getCampByName(@Param('campName') CampName: string): Promise<Camp> {
    return await this.campService.getCampByName(CampName);
  }

  // Creates a new camp entirely
  @Post()
  async createCamp(@Body() dto: CampDto): Promise<CampEntity> {
    return new CampEntity(await this.campService.createCamp(dto));
  }

  // Allows you to patch the camp data of a single camp
  @Patch(':campId')
  async editCampById(
    @Param('campId') CampId: string,
    @Body() dto: CampDto,
  ): Promise<CampEntity> {
    return new CampEntity(await this.campService.editCampById(CampId, dto));
  }

  // Allows you to patch the camp location of a single camp
  @Patch(':campId/location')
  async addCampLocationByCampId(
    @Param('campId') CampId: string,
    @Body() dto: LocationDto,
  ): Promise<Location> {
    return await this.campService.addCampLocation(CampId, dto);
  }

  // Seeds the database with the BRC camp data for a given year. Overwrites existing data.
  @HttpCode(HttpStatus.OK)
  @Get('brc_data/:year')
  async getRemoteCamps(@Param('year') year: string): Promise<IResponse> {
    return await this.campService.getRemoteCamps(year);
  }

  // Deletes a single camp by ID
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':campId')
  deleteCampById(@Param('campId') CampId: string) {
    return this.campService.deleteCampById(CampId);
  }
}
