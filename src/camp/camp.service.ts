/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { Camp } from '@prisma/client';
import fetch from 'cross-fetch';
import { PrismaClientValidationError } from "@prisma/client/runtime";
import { ResponseSuccess, ResponseError } from '../common/dto/response.dto';
import { IResponse } from '../common/interfaces/response.interface';

import { PrismaService } from '../prisma/prisma.service';
import { CampDto, CampEntity } from './dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CampService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  getCamps(): Promise<Camp[]> {
    return this.prisma.camp.findMany();
  }

  async getCampById(campId: string): Promise<Camp> {
    const Camp = await this.prisma.camp.findUnique({
      where: {
        uid: campId,
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

  // getRemoteCamps fetches the remote camps from the remote API and saves them to the db
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

      // await this.prisma.camp.createMany({
      //   data: CampsToCreate,
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

  // fetchRemoteCamps fetches the remote camps from the remote API
  async fetchRemoteCamps(year: string): Promise<Camp[]> {
    // TODO: move this to a config file / env variable and use the config service
    const url = `https://${this.config.get(
      'BRC_API_TOKEN',
    )}:@api.burningman.org/api/v1/camp?year=${year}`
    const response = await fetch(url);
    const campData = await response.json();
    return campData.map((camp: Camp) => new CampEntity(camp));
  }
}
