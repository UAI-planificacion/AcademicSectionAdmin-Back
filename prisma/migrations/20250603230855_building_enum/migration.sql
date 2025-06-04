/*
  Warnings:

  - Changed the type of `building` on the `Room` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Building" AS ENUM ('A', 'B', 'C', 'D', 'E', 'F');

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "building",
ADD COLUMN     "building" "Building" NOT NULL;
