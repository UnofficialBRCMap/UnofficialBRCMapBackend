/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { Camp, Location } from '@prisma/client';
import fetch from 'cross-fetch';
import { PrismaClientValidationError } from "@prisma/client/runtime";
import { ResponseSuccess, ResponseError } from '../common/dto/response.dto';
import { IResponse } from '../common/interfaces/response.interface';
import { PrismaService } from '../prisma/prisma.service';
import { CampDto, CampEntity, CampWithLocations } from './dto';
import { ConfigService } from '@nestjs/config';
import { LocationDto } from 'src/location/dto';

@Injectable()
export class CampService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  getCamps(): Promise<CampWithLocations[]> {
    return this.prisma.camp.findMany({
      include: {
        locations: true,
      },
    }
    );
  }

  async getCampById(campId: string): Promise<Camp> {
    const Camp = await this.prisma.camp.findUnique({
      include: {
        locations: true,
      },
      where: {
        uid: campId,
      },
    });

    if (!Camp) throw new NotFoundException('Camp not Found');

    return Camp;
  }

  // I can't believe more than one camp exists per name, but it's a concern. Should this be findMany?
  async getCampByName(campName: string): Promise<Camp> {
    const Camp = await this.prisma.camp.findFirst({
      include: {
        locations: true,
      },
      where: {
        name: campName,
      },
    });

    if (!Camp) throw new NotFoundException('Camp not Found');

    return Camp;
  }

  createCamp(dto: CampDto): Promise<Camp> {
    return this.prisma.camp.create({
      data: {
        ...dto,
      },
    });
  }

  async editCampById(campId: string, dto: CampDto): Promise<Camp> {
    const Camp = await this.prisma.camp.findUnique({
      where: {
        uid: campId,
      },
    });

    if (!Camp) throw new NotFoundException('Camp not Found');

    return this.prisma.camp.update({
      where: {
        uid: campId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteCampById(campId: string) {
    const Camp = await this.prisma.camp.findUnique({
      where: {
        uid: campId,
      },
    });

    if (!Camp) throw new NotFoundException('Camp not Found');

    await this.prisma.camp.delete({
      where: {
        uid: campId,
      },
    });
  }

  // editCampLocation updates the location of a camp
  async addCampLocation(campId: string, location: LocationDto): Promise<Location> {


    const newLocation = await this.prisma.location.create({
      data: {
        ...location,
        Camp: {
          connect: {
            uid: campId
          }
        },
      },
      include: {
        Camp: true
      }
    })
    
    return newLocation



    // const Camp = await this.prisma.camp.findUnique({
    //   where: {
    //     uid: campId,
    //   },
    //   include: {
    //     location: true
    //   }
    // });

    // if (!Camp) throw new NotFoundException('Camp not Found');

    // return this.prisma.camp.upsert({
    //   where: {
    //     uid: campId,
    //   },
    //   update: {
    //     locations: {
    //       connectOrCreate: [
    //         {
    //           create: {
    //             string: location.string,
    //             frontage: location.frontage,
    //             intersection: location.intersection,
    //             intersection_type: location.intersection_type,
    //             dimensions: location.dimensions,
    //             hour: location.hour,
    //             minute: location.minute,
    //             distance: location.distance,
    //           },
    //           where: {
    //             uid: location.campId,
    //           },
    //         },
    //       ],
    //     },
    //   },
    //   create: {
    //     ...Camp,
    //     locations: {
    //       connectOrCreate: [
    //         {
    //           create: {
    //             string: location.string,
    //             frontage: location.frontage,
    //             intersection: location.intersection,
    //             intersection_type: location.intersection_type,
    //             dimensions: location.dimensions,
    //             hour: location.hour,
    //             minute: location.minute,
    //             distance: location.distance,
    //           },
    //           where: {
    //             uid: location.campId,
    //           },
    //         },
    //       ],
    //     },
    //   },
    // });
  }


  // getRemoteCamps fetches the cammp information from the BRC API and seeds the database
  async getRemoteCamps(year: string): Promise<IResponse> {
    try {
      const remoteCamps = await this.fetchRemoteCamps(year);
      const Camps = await this.prisma.camp.findMany();

      const remoteCampIds = remoteCamps.map((Camp: Camp) => Camp.uid);
      const CampIds = Camps.map((Camp) => Camp.uid);

      const CampsToDelete = CampIds.filter((CampId) => !remoteCampIds.includes(CampId));
      const CampsToCreate = remoteCamps.filter(
        (Camp: Camp) => !CampIds.includes(Camp.uid),
      );
      await this.prisma.camp.deleteMany({
        where: {
          uid: {
            in: CampsToDelete,
          },
        },
      });

      CampsToCreate.map(async (Camp:Camp) => (
        await this.prisma.camp.create({ data: Camp })
        ));

      return new ResponseSuccess('UPDATED DB WITH BRC CAMPS DATA', null);
    } catch (error) {
      if (error instanceof PrismaClientValidationError) { 
      // TODO: Figure out why the error isn't showing up right
      return new ResponseError('FAILED TO UPDATE DB WITH BRC CAMPS DATA', error.message);
      }
      return new ResponseError('FAILED TO UPDATE DB WITH BRC CAMPS DATA', error);
    }
  }

  // fetchRemoteCamps fetches the remote camps from the remote API
  async fetchRemoteCamps(year: string): Promise<CampWithLocations[]> {
    // TODO: move this to a config file / env variable and use the config service
    const url = `https://${this.config.get(
      'BRC_API_TOKEN',
    )}:@api.burningman.org/api/v1/camp?year=${year}`
    const response = await fetch(url);
    const campData = await response.json();
    return campData.map((camp: CampWithLocations) => new CampEntity(camp));
  }
}
