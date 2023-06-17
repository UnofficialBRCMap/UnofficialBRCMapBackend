import { Camp } from '@prisma/client';

export class CampEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  year: string;
  name: string;
  url: string | null;
  contact_email: string | null;
  hometown: string | null;
  description: string | null;
  location_string: string | null;
  locationId: number | null;

  constructor(camp: Camp) {
    this.id = camp.id;
    this.createdAt = camp.createdAt;
    this.updatedAt = camp.updatedAt;
    this.name = camp.name;
    this.description = camp.description;
    this.year = camp.year;
    this.url = camp.url;
    this.contact_email = camp.contact_email;
    this.hometown = camp.hometown;
    this.location_string = camp.location_string;
    this.locationId = camp.locationId;
  }
}
