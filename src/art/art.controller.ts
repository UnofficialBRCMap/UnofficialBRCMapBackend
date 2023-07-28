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
import { ArtService } from './art.service';
import { ArtDto, ArtEntity, ArtWithLocations, ArtWithLocationsEntity } from './dto';
import { LocationDto } from '../location/dto';
import { IResponse } from '../common/interfaces/response.interface';
import { Art, Location } from '@prisma/client';

// @UseGuards(JwtGuard)
@ApiTags('Arts')
@Controller('arts')
export class ArtController {
  constructor(private artService: ArtService) {}

  // Returns all arts with locations if any exist
  @Get()
  async getArts(): Promise<ArtWithLocationsEntity[]> {
    const Arts = await this.artService.getArts();
    return Arts.map((Art: ArtWithLocations) => new ArtWithLocationsEntity(Art));
  }

  // Returns a single art by its id
  @Get(':artId')
  async getArtById(@Param('artId') ArtId: string): Promise<Art> {
    return await this.artService.getArtById(ArtId);
  }

  // Returns a single art by its name with locations if any exist
  @Get(':artName')
  async getArtByName(@Param('artName') ArtName: string): Promise<Art> {
    return await this.artService.getArtByName(ArtName);
  }

  // Creates a new art entirely
  @Post()
  async createArt(@Body() dto: ArtDto): Promise<ArtEntity> {
    return new ArtEntity(await this.artService.createArt(dto));
  }

  // Allows you to patch the art data of a single art
  @Patch(':artId')
  async editArtById(
    @Param('artId') ArtId: string,
    @Body() dto: ArtDto,
  ): Promise<ArtEntity> {
    return new ArtEntity(await this.artService.editArtById(ArtId, dto));
  }

  // Allows you to patch the art location of a single art
  @Post(':artId/location')
  async addArtLocationByArtId(
    @Param('artId') ArtId: string,
    @Body() dto: LocationDto,
  ): Promise<Location> {
    return await this.artService.addArtLocation(ArtId, dto);
  }

  // Seeds the database with the BRC art data for a given year. Overwrites existing data.
  @HttpCode(HttpStatus.OK)
  @Get('brc_data/:year')
  async getRemoteArts(@Param('year') year: string): Promise<IResponse> {
    return await this.artService.getRemoteArts(year);
  }

  // Deletes a single art by ID
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':artId')
  deleteArtById(@Param('artId') ArtId: string) {
    return this.artService.deleteArtById(ArtId);
  }

  // Creates mock location data for a given number of arts
  @HttpCode(HttpStatus.OK)
  @Get('mock_data/:count')
  async createMockArts(@Param('count') count: number): Promise<IResponse> {
    return await this.artService.populateLocationDev(count, 1);
  }
}
