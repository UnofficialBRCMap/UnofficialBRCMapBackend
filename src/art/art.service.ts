/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { Art, Location } from '@prisma/client';
import fetch from 'cross-fetch';
import { PrismaClientValidationError } from "@prisma/client/runtime";
import { ResponseSuccess, ResponseError } from '../common/dto/response.dto';
import { IResponse } from '../common/interfaces/response.interface';
import { PrismaService } from '../prisma/prisma.service';
import { ArtDto, ArtEntity, ArtWithLocations } from './dto';
import { ConfigService } from '@nestjs/config';
import { LocationDto } from 'src/location/dto';
import { randomLocation } from 'src/location/location.mocks';

@Injectable()
export class ArtService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  getArts(): Promise<ArtWithLocations[]> {
    return this.prisma.art.findMany({
      orderBy: [
        {
          name: 'asc',
        },
      ],  
      include: {
        locations: true,
      },
    }
    );
  }

  async getArtById(artId: string): Promise<Art> {
    const Art = await this.prisma.art.findUnique({
      include: {
        locations: true,
      },
      where: {
        uid: artId,
      },
    });

    if (!Art) throw new NotFoundException('Art not Found');

    return Art;
  }

  // I can't believe more than one art exists per name, but it's a concern. Should this be findMany?
  async getArtByName(artName: string): Promise<Art> {
    const Art = await this.prisma.art.findFirst({
      include: {
        locations: true,
      },
      where: {
        name: artName,
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

  // addArtLocation adds a new art location to the database
  async addArtLocation(artId: string, location: LocationDto): Promise<Location> {

    const newLocation = await this.prisma.location.create({
      data: {
        ...location,
        Art: {
          connect: {
            uid: artId
          }
        },
      },
      include: {

        Art: true
      }
    })

    return newLocation

  
  }

  // getRemoteArts fetches the cammp information from the BRC API and seeds the database
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

      return new ResponseSuccess('UPDATED DB WITH BRC ARTS DATA', null);
    } catch (error) {
      if (error instanceof PrismaClientValidationError) { 
      // TODO: Figure out why the error isn't showing up right
      return new ResponseError('FAILED TO UPDATE DB WITH BRC ARTS DATA', error.message);
      }
      return new ResponseError('FAILED TO UPDATE DB WITH BRC ARTS DATA', error);
    }
  }

  // fetchRemoteArts fetches the remote arts from the remote API
  async fetchRemoteArts(year: string): Promise<ArtWithLocations[]> {
    // TODO: move this to a config file / env variable and use the config service
    const url = `https://${this.config.get(
      'BRC_API_TOKEN',
    )}:@api.burningman.org/api/v1/art?year=${year}`
    const response = await fetch(url);
    const artData = await response.json();
    return artData.map((art: ArtWithLocations) => new ArtEntity(art));
  }

   // populateLocationDev is a helper function that pulls N number of arts, and using the addArtLocation function, creates N fake location data for them
  async populateLocationDev(artCount: number, locationCount: number): Promise<IResponse> {
    try {
      const arts = await this.prisma.art.findMany({
        take: artCount,
      });
      arts.map(async (art: Art) => {
        for (let i = 0; i < locationCount; i++) {
          const location = {
            string: randomLocation(),
            frontage: "string",
            intersection: "string",
            intersection_type: "string",
            dimensions: "string",
            hour: 0,
            minute: 0,
            distance: 0,
            category: "string",
            gps_latitude: 0,
            gps_longitude: 0
          };
          await this.addArtLocation(art.uid, location);
        }
      });
      return new ResponseSuccess('Populated locations', null);
    } catch (error) {
      return new ResponseError('Failed to populate locations', error);
    }
  }
}
