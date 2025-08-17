/*
  Warnings:

  - You are about to drop the column `brand` on the `Outfit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Outfit" DROP COLUMN "brand",
ADD COLUMN     "brands" TEXT[],
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT true;
