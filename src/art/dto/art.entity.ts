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
  artist: string | null;
  category: string | null;
  program: string | null;
  donation_link: string | null;
  guided_tours: number | null;
  self_guided_tour_map: number | null;
  thumbnail_url: string | null;

  constructor(art: Art) {
    this.uid = art.uid;
    this.createdAt = art.createdAt;
    this.updatedAt = art.updatedAt;
    this.year = art.year;
    this.name = String(art.name);
    this.description = art.description;
    this.url = art.url;
    this.contact_email = art.contact_email;
    this.hometown = art.hometown;
    this.description = art.description;
    this.artist = art.artist;
    this.category = art.category;
    this.program = art.program;
    this.donation_link = art.donation_link;
    this.guided_tours = art.guided_tours;
    this.self_guided_tour_map = art.self_guided_tour_map;
    this.thumbnail_url = art.thumbnail_url;
  }
}
