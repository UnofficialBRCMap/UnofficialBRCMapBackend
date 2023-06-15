/*
  Warnings:

  - You are about to drop the column `bio` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `firstname` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lastname` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `profilePic` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `storesFollowed` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `userName` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stripeId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[resetPasswordToken]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hash` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "users_userName_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "bio",
DROP COLUMN "firstname",
DROP COLUMN "lastname",
DROP COLUMN "password",
DROP COLUMN "phoneNumber",
DROP COLUMN "profilePic",
DROP COLUMN "storesFollowed",
DROP COLUMN "userName",
ADD COLUMN     "allowMultiple" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "hash" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "resetPasswordExpires" TIMESTAMP(3),
ADD COLUMN     "resetPasswordToken" TEXT,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER',
ADD COLUMN     "stripeId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_stripeId_key" ON "users"("stripeId");

-- CreateIndex
CREATE UNIQUE INDEX "users_resetPasswordToken_key" ON "users"("resetPasswordToken");
