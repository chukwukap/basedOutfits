/*
  Warnings:

  - You are about to drop the column `fid` on the `Outfit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Outfit" DROP COLUMN "fid";

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "fid" TEXT;
