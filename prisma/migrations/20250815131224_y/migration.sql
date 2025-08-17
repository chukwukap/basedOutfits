/*
  Warnings:

  - You are about to drop the column `brands` on the `Outfit` table. All the data in the column will be lost.
  - You are about to drop the column `colors` on the `Outfit` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Outfit` table. All the data in the column will be lost.
  - You are about to drop the column `occasion` on the `Outfit` table. All the data in the column will be lost.
  - You are about to drop the column `season` on the `Outfit` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `Outfit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Outfit" DROP COLUMN "brands",
DROP COLUMN "colors",
DROP COLUMN "location",
DROP COLUMN "occasion",
DROP COLUMN "season",
DROP COLUMN "tags";
