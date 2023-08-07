import { Prisma } from '@prisma/client';

export type ArtWithLocations = Prisma.ArtGetPayload<{
  include: { locations: true };
}>;
