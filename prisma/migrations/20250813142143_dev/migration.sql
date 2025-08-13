/*
  Warnings:

  - You are about to drop the column `mediaUrl` on the `Look` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Look" DROP COLUMN "mediaUrl",
ADD COLUMN     "audioUrl" TEXT,
ADD COLUMN     "brand" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "linkUrl" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "price" DOUBLE PRECISION,
ADD COLUMN     "videoUrl" TEXT;
