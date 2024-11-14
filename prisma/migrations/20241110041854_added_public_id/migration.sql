/*
  Warnings:

  - A unique constraint covering the columns `[publicId]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `publicId` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "publicId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Users_publicId_key" ON "Users"("publicId");
