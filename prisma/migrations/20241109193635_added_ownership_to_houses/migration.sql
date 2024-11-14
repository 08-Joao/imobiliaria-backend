/*
  Warnings:

  - Added the required column `ownership` to the `Houses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Houses" ADD COLUMN     "ownership" TEXT NOT NULL;
