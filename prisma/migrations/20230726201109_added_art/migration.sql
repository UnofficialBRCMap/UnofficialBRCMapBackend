/*
  Warnings:

  - The primary key for the `locations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[uid]` on the table `locations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[location_art_uid]` on the table `locations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `location_art_uid` to the `locations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "locations" DROP CONSTRAINT "locations_pkey",
ADD COLUMN     "location_art_uid" TEXT NOT NULL,
ADD CONSTRAINT "locations_pkey" PRIMARY KEY ("uid", "location_art_uid");

-- CreateTable
CREATE TABLE "arts" (
    "uid" TEXT NOT NULL,
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
    "thumbnail_url" TEXT,

    CONSTRAINT "arts_pkey" PRIMARY KEY ("uid")
);

-- CreateIndex
CREATE UNIQUE INDEX "locations_uid_key" ON "locations"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "locations_location_art_uid_key" ON "locations"("location_art_uid");

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_location_art_uid_fkey" FOREIGN KEY ("location_art_uid") REFERENCES "arts"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
