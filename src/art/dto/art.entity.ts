import { Art } from '@prisma/client';

export class ArtEntity {
  uid: string;
  createdAt: Date;
  updatedAt: Date;
  year: number;
  name: string;
  url: string | null;
  contact_email: string | null;
  hometown: string | null;
  description: string | null;

  constructor(art: Art) {
    this.uid = art.uid;
    this.createdAt = art.createdAt;
    this.updatedAt = art.updatedAt;
    this.name = String(art.name);
    this.description = art.description;
    this.year = art.year;
    this.url = art.url;
    this.contact_email = art.contact_email;
    this.hometown = art.hometown;
  }
}
