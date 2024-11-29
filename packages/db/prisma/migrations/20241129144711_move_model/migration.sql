/*
  Warnings:

  - You are about to drop the column `after` on the `Move` table. All the data in the column will be lost.
  - You are about to drop the column `before` on the `Move` table. All the data in the column will be lost.
  - You are about to drop the column `san` on the `Move` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Move" DROP COLUMN "after",
DROP COLUMN "before",
DROP COLUMN "san";
