/*
  Warnings:

  - You are about to drop the column `order` on the `Module` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DayModule" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Module" DROP COLUMN "order";
