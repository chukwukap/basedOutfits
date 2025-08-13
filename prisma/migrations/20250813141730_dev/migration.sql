/*
  Warnings:

  - You are about to drop the column `fid` on the `Look` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Look" DROP COLUMN "fid";

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "fid" TEXT;
