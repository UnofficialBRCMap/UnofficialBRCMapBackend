/*
  Warnings:

  - The primary key for the `camps` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `camps` table. All the data in the column will be lost.
  - You are about to drop the column `locationId` on the `camps` table. All the data in the column will be lost.
  - You are about to drop the column `location_string` on the `camps` table. All the data in the column will be lost.
  - You are about to drop the column `stripeId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `Location` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `arts` table. If the table is not empty, all the data it contains will be lost.
  - The required column `uid` was added to the `camps` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Changed the type of `year` on the `camps` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "arts" DROP CONSTRAINT "arts_locationId_fkey";

-- DropForeignKey
ALTER TABLE "camps" DROP CONSTRAINT "camps_locationId_fkey";

-- DropIndex
DROP INDEX "users_stripeId_key";

-- AlterTable
ALTER TABLE "camps" DROP CONSTRAINT "camps_pkey",
DROP COLUMN "id",
DROP COLUMN "locationId",
DROP COLUMN "location_string",
ADD COLUMN     "uid" TEXT NOT NULL,
DROP COLUMN "year",
ADD COLUMN     "year" INTEGER NOT NULL,
ADD CONSTRAINT "camps_pkey" PRIMARY KEY ("uid");

-- AlterTable
ALTER TABLE "users" DROP COLUMN "stripeId";

-- DropTable
DROP TABLE "Location";

-- DropTable
DROP TABLE "arts";

-- CreateTable
CREATE TABLE "locations" (
    "uid" TEXT NOT NULL,
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

    CONSTRAINT "locations_pkey" PRIMARY KEY ("uid")
);

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_uid_fkey" FOREIGN KEY ("uid") REFERENCES "camps"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
