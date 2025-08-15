-- DropIndex
DROP INDEX "public"."User_walletAddress_key";

-- AlterTable
ALTER TABLE "public"."Look" ADD COLUMN     "colors" TEXT[],
ADD COLUMN     "details" JSONB,
ADD COLUMN     "occasion" TEXT,
ADD COLUMN     "season" TEXT;
