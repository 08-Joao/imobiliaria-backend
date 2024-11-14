-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'AGENT';

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "profileBanner" TEXT NOT NULL DEFAULT 'defaultBanner.jpg',
ALTER COLUMN "profilePicture" SET DEFAULT 'defaultPicture.jpg';
