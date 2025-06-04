/*
  Warnings:

  - The `difference` column on the `Module` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ModuleDifference" AS ENUM ('A', 'B');

-- AlterTable
ALTER TABLE "Module" DROP COLUMN "difference",
ADD COLUMN     "difference" "ModuleDifference";
