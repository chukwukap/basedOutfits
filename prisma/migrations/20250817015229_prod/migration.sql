/*
  Warnings:

  - You are about to drop the column `lookId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `lookId` on the `Like` table. All the data in the column will be lost.
  - You are about to drop the column `lookId` on the `Tip` table. All the data in the column will be lost.
  - You are about to drop the `LookbookItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Outfitly` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,outfitId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `outfitId` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `outfitId` to the `Like` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Comment" DROP CONSTRAINT "Comment_lookId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Like" DROP CONSTRAINT "Like_lookId_fkey";

-- DropForeignKey
ALTER TABLE "public"."LookbookItem" DROP CONSTRAINT "LookbookItem_addedById_fkey";

-- DropForeignKey
ALTER TABLE "public"."LookbookItem" DROP CONSTRAINT "LookbookItem_lookId_fkey";

-- DropForeignKey
ALTER TABLE "public"."LookbookItem" DROP CONSTRAINT "LookbookItem_lookbookId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Outfitly" DROP CONSTRAINT "Lookbook_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Tip" DROP CONSTRAINT "Tip_lookId_fkey";

-- DropIndex
DROP INDEX "public"."Comment_lookId_idx";

-- DropIndex
DROP INDEX "public"."Like_userId_lookId_key";

-- AlterTable
ALTER TABLE "public"."Comment" DROP COLUMN "lookId",
ADD COLUMN     "outfitId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Like" DROP COLUMN "lookId",
ADD COLUMN     "outfitId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Outfit" RENAME CONSTRAINT "Look_pkey" TO "Outfit_pkey";

-- AlterTable
ALTER TABLE "public"."Tip" DROP COLUMN "lookId",
ADD COLUMN     "outfitId" TEXT;

-- DropTable
DROP TABLE "public"."LookbookItem";

-- DropTable
DROP TABLE "public"."Outfitly";

-- CreateTable
CREATE TABLE "public"."Wardrobe" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "coverImage" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wardrobe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WardrobeItem" (
    "id" TEXT NOT NULL,
    "outfitId" TEXT NOT NULL,
    "wardrobeId" TEXT NOT NULL,
    "addedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WardrobeItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Wardrobe_ownerId_idx" ON "public"."Wardrobe"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "WardrobeItem_outfitId_wardrobeId_key" ON "public"."WardrobeItem"("outfitId", "wardrobeId");

-- CreateIndex
CREATE INDEX "Comment_outfitId_idx" ON "public"."Comment"("outfitId");

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_outfitId_key" ON "public"."Like"("userId", "outfitId");

-- RenameForeignKey
ALTER TABLE "public"."Outfit" RENAME CONSTRAINT "Look_authorId_fkey" TO "Outfit_authorId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Wardrobe" ADD CONSTRAINT "Wardrobe_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WardrobeItem" ADD CONSTRAINT "WardrobeItem_outfitId_fkey" FOREIGN KEY ("outfitId") REFERENCES "public"."Outfit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WardrobeItem" ADD CONSTRAINT "WardrobeItem_wardrobeId_fkey" FOREIGN KEY ("wardrobeId") REFERENCES "public"."Wardrobe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WardrobeItem" ADD CONSTRAINT "WardrobeItem_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Like" ADD CONSTRAINT "Like_outfitId_fkey" FOREIGN KEY ("outfitId") REFERENCES "public"."Outfit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_outfitId_fkey" FOREIGN KEY ("outfitId") REFERENCES "public"."Outfit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Tip" ADD CONSTRAINT "Tip_outfitId_fkey" FOREIGN KEY ("outfitId") REFERENCES "public"."Outfit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "public"."Look_authorId_idx" RENAME TO "Outfit_authorId_idx";
