/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { Camp } from '@prisma/client';
import { ResponseSuccess, ResponseError } from '../common/dto/response.dto';
import { IResponse } from '../common/interfaces/response.interface';

import { PrismaService } from '../prisma/prisma.service';
import { CampDto } from './dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CampService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    ) {}

  getCamps(): Promise<Camp[]> {
    return this.prisma.camp.findMany();
  }

  async getCampById(campId: string): Promise<Camp> {
    const Camp = await this.prisma.camp.findUnique({
      where: {
        id: campId,
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
        id: campId,
      },
    });

    if (!Camp) throw new NotFoundException('Camp not Found');

    return this.prisma.camp.update({
      where: {
        id: campId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteCampById(campId: string) {
    const Camp = await this.prisma.camp.findUnique({
      where: {
        id: campId,
      },
    });

    if (!Camp) throw new NotFoundException('Camp not Found');

    await this.prisma.camp.delete({
      where: {
        id: campId,
      },
    });
  }

  // getRemoteCamps fetches the remote camps from the remote API and saves them to the db
  async getRemoteCamps(year: string): Promise<IResponse> {
    try {
      const remoteCamps = await this.fetchRemoteCamps(year);
      const Camps = await this.prisma.camp.findMany();

      const remoteCampIds = remoteCamps.map((Camp: Camp) => Camp.id);
      const CampIds = Camps.map((Camp) => Camp.id);

      const CampsToDelete = CampIds.filter((CampId) => !remoteCampIds.includes(CampId));
      const CampsToCreate = remoteCamps.filter(
        (Camp: Camp) => !CampIds.includes(Camp.id),
      );
      await this.prisma.camp.deleteMany({
        where: {
          id: {
            in: CampsToDelete,
          },
        },
      });
      await this.prisma.camp.createMany({
        data: CampsToCreate,
      });
      return new ResponseSuccess('UPDATED DB WITH BRC CAMPS DATA', null);
    } catch (error) {
      return new ResponseError('FAILED TO UPDATE DB WITH BRC CAMPS DATA', error);
    }
  }

  // fetchRemoteCamps fetches the remote camps from the remote API
  async fetchRemoteCamps(year: string): Promise<Camp[]> {
    const response = await fetch(`https://${this.config.get('BRC_API_TOKEN')}:@api.burningman.org/api/v1/camp?year=${year}`);
    const data = await response.json();
    return data.data;
  }
}
