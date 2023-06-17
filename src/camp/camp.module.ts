import { Module } from '@nestjs/common';

import { CampController } from './camp.controller';
import { CampService } from './camp.service';

@Module({
  controllers: [CampController],
  providers: [CampService],
})
export class CampModule {}
