import { Prisma } from '@prisma/client';

export type CampWithLocations = Prisma.CampGetPayload<{
  include: { locations: true };
}>;
