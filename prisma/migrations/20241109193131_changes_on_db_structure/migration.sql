-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "favorites" INTEGER[],
ADD COLUMN     "profilePicture" TEXT NOT NULL DEFAULT 'default.jpg';

-- CreateTable
CREATE TABLE "house" (
    "id" SERIAL NOT NULL,
    "price" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "suites" INTEGER NOT NULL,
    "bedrooms" INTEGER NOT NULL,
    "bathrooms" INTEGER NOT NULL,
    "garages" INTEGER NOT NULL,
    "media" TEXT[],

    CONSTRAINT "house_pkey" PRIMARY KEY ("id")
);
