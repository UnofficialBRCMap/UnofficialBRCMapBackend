/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { Art } from '@prisma/client';
import fetch from 'cross-fetch';
import { PrismaClientValidationError } from "@prisma/client/runtime";
import { ResponseSuccess, ResponseError } from '../common/dto/response.dto';
import { IResponse } from '../common/interfaces/response.interface';

import { PrismaService } from '../prisma/prisma.service';
import { ArtDto, ArtEntity } from './dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ArtService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  getArts(): Promise<Art[]> {
    return this.prisma.art.findMany();
  }

  async getArtById(artId: string): Promise<Art> {
    const Art = await this.prisma.art.findUnique({
      where: {
        uid: artId,
      },
    });

    if (!Art) throw new NotFoundException('Art not Found');

    return Art;
  }

  createArt(dto: ArtDto): Promise<Art> {
    return this.prisma.art.create({
      data: {
        ...dto,
      },
    });
  }

  async editArtById(artId: string, dto: ArtDto): Promise<Art> {
    const Art = await this.prisma.art.findUnique({
      where: {
        uid: artId,
      },
    });

    if (!Art) throw new NotFoundException('Art not Found');

    return this.prisma.art.update({
      where: {
        uid: artId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteArtById(artId: string) {
    const Art = await this.prisma.art.findUnique({
      where: {
        uid: artId,
      },
    });

    if (!Art) throw new NotFoundException('Art not Found');

    await this.prisma.art.delete({
      where: {
        uid: artId,
      },
    });
  }

  // getRemoteArts fetches the remote arts from the remote API and saves them to the db
  async getRemoteArts(year: string): Promise<IResponse> {
    try {
      const remoteArts = await this.fetchRemoteArts(year);
      const Arts = await this.prisma.art.findMany();

      const remoteArtIds = remoteArts.map((Art: Art) => Art.uid);
      const ArtIds = Arts.map((Art) => Art.uid);

      const ArtsToDelete = ArtIds.filter((ArtId) => !remoteArtIds.includes(ArtId));
      const ArtsToCreate = remoteArts.filter(
        (Art: Art) => !ArtIds.includes(Art.uid),
      );
      await this.prisma.art.deleteMany({
        where: {
          uid: {
            in: ArtsToDelete,
          },
        },
      });

      ArtsToCreate.map(async (Art:Art) => (
        await this.prisma.art.create({ data: Art })
        ));

      // await this.prisma.art.createMany({
      //   data: ArtsToCreate,
      // });
      return new ResponseSuccess('UPDATED DB WITH BRC CAMPS DATA', null);
    } catch (error) {
      if (error instanceof PrismaClientValidationError) { 
      // TODO: Figure out why the error isn't showing up right
      return new ResponseError('FAILED TO UPDATE DB WITH BRC CAMPS DATA', error.message);
      }
      return new ResponseError('FAILED TO UPDATE DB WITH BRC CAMPS DATA', error);
    }
  }

  // fetchRemoteArts fetches the remote arts from the remote API
  async fetchRemoteArts(year: string): Promise<Art[]> {
    // TODO: move this to a config file / env variable and use the config service
    const url = `https://${this.config.get(
      'BRC_API_TOKEN',
    )}:@api.burningman.org/api/v1/art?year=${year}`
    const response = await fetch(url);
    const artData = await response.json();
    return artData.map((art: Art) => new ArtEntity(art));
  }
}
