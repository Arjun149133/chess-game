-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "player1TimeConsumed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "player2TimeConsumed" INTEGER NOT NULL DEFAULT 0;
