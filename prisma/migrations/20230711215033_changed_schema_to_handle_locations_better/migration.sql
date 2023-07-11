/*
  Warnings:

  - Added the required column `campId` to the `locations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `locations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "locations" DROP CONSTRAINT "locations_uid_fkey";

-- AlterTable
ALTER TABLE "locations" ADD COLUMN     "campId" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_campId_fkey" FOREIGN KEY ("campId") REFERENCES "camps"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
