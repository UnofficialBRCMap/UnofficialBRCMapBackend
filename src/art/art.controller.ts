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
import { Art } from '@prisma/client';
// import { JwtGuard } from '../auth/guard';
import { ArtService } from './art.service';
import { ArtDto, ArtEntity } from './dto';
import { IResponse } from '../common/interfaces/response.interface';

// @UseGuards(JwtGuard)
@ApiTags('Arts')
@Controller('arts')
export class ArtController {
  constructor(private artService: ArtService) {}

  @Get()
  async getArts(): Promise<ArtEntity[]> {
    const Arts = await this.artService.getArts();
    return Arts.map((Art: Art) => new ArtEntity(Art));
  }

  @Get(':artId')
  async getArtById(@Param('artId') ArtId: string): Promise<ArtEntity> {
    return new ArtEntity(await this.artService.getArtById(ArtId));
  }

  @Post()
  async createArt(@Body() dto: ArtDto): Promise<ArtEntity> {
    return new ArtEntity(await this.artService.createArt(dto));
  }

  @Patch(':artId')
  async editArtById(
    @Param('artId') ArtId: string,
    @Body() dto: ArtDto,
  ): Promise<ArtEntity> {
    return new ArtEntity(await this.artService.editArtById(ArtId, dto));
  }

  @HttpCode(HttpStatus.OK)
  @Get('brc_data/:year')
  async getRemoteArts(@Param('year') year: string): Promise<IResponse> {
    return await this.artService.getRemoteArts(year);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':artId')
  deleteArtById(@Param('artId') ArtId: string) {
    return this.artService.deleteArtById(ArtId);
  }
}
