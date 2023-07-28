import { Camp, Location } from '@prisma/client';
import { CampWithLocations } from './camp.types';

export class CampEntity {
  uid: string;
  createdAt: Date;
  updatedAt: Date;
  year: number;
  name: string;
  url: string | null;
  contact_email: string | null;
  hometown: string | null;
  description: string | null;

  constructor(camp: Camp) {
    this.uid = camp.uid;
    this.createdAt = camp.createdAt;
    this.updatedAt = camp.updatedAt;
    this.name = String(camp.name);
    this.description = camp.description;
    this.year = camp.year;
    this.url = camp.url;
    this.contact_email = camp.contact_email;
    this.hometown = camp.hometown;
  }
}

export class CampWithLocationsEntity {
  uid: string;
  createdAt: Date;
  updatedAt: Date;
  year: number;
  name: string;
  url: string | null;
  contact_email: string | null;
  hometown: string | null;
  description: string | null;
  locations: Location[];

  constructor(camp: CampWithLocations) {
    this.uid = camp.uid;
    this.createdAt = camp.createdAt;
    this.updatedAt = camp.updatedAt;
    this.name = String(camp.name);
    this.description = camp.description;
    this.year = camp.year;
    this.url = camp.url;
    this.contact_email = camp.contact_email;
    this.hometown = camp.hometown;
    this.locations = camp.locations;
  }
}
