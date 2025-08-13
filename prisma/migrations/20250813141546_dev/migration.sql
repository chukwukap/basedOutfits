/*
  Warnings:

  - You are about to drop the column `passwordHash` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Look" ADD COLUMN     "fid" TEXT;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "passwordHash",
ALTER COLUMN "email" DROP NOT NULL;
