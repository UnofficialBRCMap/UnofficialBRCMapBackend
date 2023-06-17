import { Injectable, NotFoundException } from '@nestjs/common';
import { Camp } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { CampDto } from './dto';

@Injectable()
export class CampService {
  constructor(private prisma: PrismaService) {}

  getCamps(): Promise<Camp[]> {
    return this.prisma.camp.findMany();
  }

  async getCampById(CampId: string): Promise<Camp> {
    const Camp = await this.prisma.camp.findUnique({
      where: {
        id: CampId,
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

  async editCampById(CampId: string, dto: CampDto): Promise<Camp> {
    const Camp = await this.prisma.camp.findUnique({
      where: {
        id: CampId,
      },
    });

    if (!Camp) throw new NotFoundException('Camp not Found');

    return this.prisma.camp.update({
      where: {
        id: CampId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteCampById(CampId: string) {
    const Camp = await this.prisma.camp.findUnique({
      where: {
        id: CampId,
      },
    });

    if (!Camp) throw new NotFoundException('Camp not Found');

    await this.prisma.camp.delete({
      where: {
        id: CampId,
      },
    });
  }
}
