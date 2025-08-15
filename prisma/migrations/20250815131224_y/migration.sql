/*
  Warnings:

  - You are about to drop the column `brands` on the `Look` table. All the data in the column will be lost.
  - You are about to drop the column `colors` on the `Look` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Look` table. All the data in the column will be lost.
  - You are about to drop the column `occasion` on the `Look` table. All the data in the column will be lost.
  - You are about to drop the column `season` on the `Look` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `Look` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Look" DROP COLUMN "brands",
DROP COLUMN "colors",
DROP COLUMN "location",
DROP COLUMN "occasion",
DROP COLUMN "season",
DROP COLUMN "tags";
