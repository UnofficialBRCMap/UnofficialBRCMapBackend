import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }

  // update this function to return the types of the models you've generated
  cleanDb() {
    return this.$transaction([
      this.camp.deleteMany(),
      this.art.deleteMany(),
      this.user.deleteMany(),
    ]);
  }
}
