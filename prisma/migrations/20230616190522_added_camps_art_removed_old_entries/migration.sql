/*
  Warnings:

  - You are about to drop the `UsersOnRoom` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reviews` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rooms` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `shops` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UsersOnRoom" DROP CONSTRAINT "UsersOnRoom_roomId_fkey";

-- DropForeignKey
ALTER TABLE "UsersOnRoom" DROP CONSTRAINT "UsersOnRoom_userId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_shopId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_userId_fkey";

-- DropForeignKey
ALTER TABLE "shops" DROP CONSTRAINT "shops_userId_fkey";

-- DropTable
DROP TABLE "UsersOnRoom";

-- DropTable
DROP TABLE "reviews";

-- DropTable
DROP TABLE "rooms";

-- DropTable
DROP TABLE "shops";

-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "string" TEXT,
    "frontage" TEXT,
    "intersection" TEXT,
    "intersection_type" TEXT,
    "dimensions" TEXT,
    "hour" INTEGER,
    "minute" INTEGER,
    "distance" INTEGER,
    "category" TEXT,
    "gps_latitude" DOUBLE PRECISION,
    "gps_longitude" DOUBLE PRECISION,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "camps" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "year" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT,
    "contact_email" TEXT,
    "hometown" TEXT,
    "description" TEXT,
    "location_string" TEXT,
    "locationId" INTEGER,

    CONSTRAINT "camps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Art" (
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

    CONSTRAINT "Art_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "camps" ADD CONSTRAINT "camps_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Art" ADD CONSTRAINT "Art_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
