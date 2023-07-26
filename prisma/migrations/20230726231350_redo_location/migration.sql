/*
  Warnings:

  - The primary key for the `locations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `location_art_uid` on the `locations` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "locations" DROP CONSTRAINT "locations_location_art_uid_fkey";

-- DropForeignKey
ALTER TABLE "locations" DROP CONSTRAINT "locations_uid_fkey";

-- DropIndex
DROP INDEX "locations_location_art_uid_key";

-- DropIndex
DROP INDEX "locations_uid_key";

-- AlterTable
ALTER TABLE "locations" DROP CONSTRAINT "locations_pkey",
DROP COLUMN "location_art_uid",
ADD COLUMN     "artId" TEXT,
ADD COLUMN     "campId" TEXT,
ADD CONSTRAINT "locations_pkey" PRIMARY KEY ("uid");

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_campId_fkey" FOREIGN KEY ("campId") REFERENCES "camps"("uid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_artId_fkey" FOREIGN KEY ("artId") REFERENCES "arts"("uid") ON DELETE SET NULL ON UPDATE CASCADE;
