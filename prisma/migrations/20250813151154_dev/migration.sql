/*
  Warnings:

  - You are about to drop the column `audioUrl` on the `Look` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Look` table. All the data in the column will be lost.
  - You are about to drop the column `linkUrl` on the `Look` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Look` table. All the data in the column will be lost.
  - You are about to drop the column `videoUrl` on the `Look` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Look" DROP COLUMN "audioUrl",
DROP COLUMN "imageUrl",
DROP COLUMN "linkUrl",
DROP COLUMN "price",
DROP COLUMN "videoUrl",
ADD COLUMN     "imageUrls" TEXT[];
