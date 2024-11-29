/*
  Warnings:

  - You are about to drop the `_UserFavorites` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Houses" DROP CONSTRAINT "Houses_ownership_fkey";

-- DropForeignKey
ALTER TABLE "_UserFavorites" DROP CONSTRAINT "_UserFavorites_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserFavorites" DROP CONSTRAINT "_UserFavorites_B_fkey";

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "favorites" INTEGER[],
ADD COLUMN     "houses" INTEGER[];

-- DropTable
DROP TABLE "_UserFavorites";
