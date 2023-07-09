/*
  Warnings:

  - You are about to drop the `Art` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Art" DROP CONSTRAINT "Art_locationId_fkey";

-- DropTable
DROP TABLE "Art";

-- CreateTable
CREATE TABLE "arts" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "year" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT,
    "contact_email" TEXT,
    "hometown" TEXT,
    "description" TEXT,
    "artist" TEXT,
    "category" TEXT,
    "program" TEXT,
    "donation_link" TEXT,
    "guided_tours" INTEGER,
    "self_guided_tour_map" INTEGER,
    "location_string" TEXT,
    "thumbnail_url" TEXT,
    "locationId" INTEGER,

    CONSTRAINT "arts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "arts" ADD CONSTRAINT "arts_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
