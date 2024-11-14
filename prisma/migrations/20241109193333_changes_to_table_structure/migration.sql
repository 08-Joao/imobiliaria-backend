/*
  Warnings:

  - You are about to drop the `house` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "house";

-- CreateTable
CREATE TABLE "Houses" (
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

    CONSTRAINT "Houses_pkey" PRIMARY KEY ("id")
);
