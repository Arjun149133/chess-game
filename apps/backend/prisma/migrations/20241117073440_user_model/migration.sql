-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('Google', 'Password');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "provider" "Provider",
ALTER COLUMN "password" DROP NOT NULL;
