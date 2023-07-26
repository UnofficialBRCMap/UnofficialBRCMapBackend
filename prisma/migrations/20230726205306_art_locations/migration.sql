/*
  Warnings:

  - You are about to drop the column `campId` on the `locations` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `locations` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `locations` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "locations" DROP CONSTRAINT "locations_campId_fkey";

-- AlterTable
ALTER TABLE "locations" DROP COLUMN "campId",
DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_uid_fkey" FOREIGN KEY ("uid") REFERENCES "camps"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
