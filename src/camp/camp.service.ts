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
import { randomLocation } from 'src/location/location.mocks';

@Injectable()
export class CampService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  getCamps(): Promise<CampWithLocations[]> {
    return this.prisma.camp.findMany({
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

  // formatString turns a location string to array, split on the & character so we can use them to populate frontages and intersections
  formatString(string: string): {frontage: string, intersection: string} {
    let fi = {
      frontage: '',
      intersection: ''
    }

    if (string.includes('&')) {
      const frontages = string.split('&').map((item) => item.trim());
      fi.frontage = frontages[0];
      fi.intersection = frontages[1];
      return fi;
    }
    if (string.includes('@')) {
      const frontages = string.split('@').map((item) => item.trim());
      fi.frontage = frontages[0];
      fi.intersection = frontages[1];
      return fi;
    }
    return  fi = { frontage: string, intersection: '' };
  }


  // addCampLocation adds a new camp location to the database
  async addCampLocation(campId: string, location: LocationDto): Promise<Location> {
    const f = this.formatString(location.string);
    location.frontage = f.frontage;
    location.intersection = f.intersection;

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
  }

  // updateAllLocationsWithFrontages updates all locations with the frontage and intersection data
  async updateAllLocationsWithFrontages(): Promise<IResponse> {
    try {
      const locations = await this.prisma.location.findMany();
      locations.map(async (location) => {
        if (location.string === null) return;
        const frontages = this.formatString(location.string);
        await this.prisma.location.update({
          where: {
            uid: location.uid
          },
          data: {
            frontage: frontages[0],
            intersection: frontages[1]
          }
        })
      })
      return new ResponseSuccess('Updated all locations with frontages', null);
    } catch (error) {
      return new ResponseError('Failed to update all locations with frontages', error);
    }
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

   // populateLocationDev is a helper function that pulls N number of camps, and using the addCampLocation function, creates N fake location data for them
  async populateLocationDev(campCount: number, locationCount: number): Promise<IResponse> {
    try {
      const camps = await this.prisma.camp.findMany({
        take: campCount,
      });
      camps.map(async (camp: Camp) => {
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
          await this.addCampLocation(camp.uid, location);
        }
      });
      return new ResponseSuccess('Populated locations', null);
    } catch (error) {
      return new ResponseError('Failed to populate locations', error);
    }
  }
}
