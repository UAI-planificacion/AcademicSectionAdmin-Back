/*
  Warnings:

  - You are about to drop the column `number` on the `Section` table. All the data in the column will be lost.
  - Changed the type of `code` on the `Section` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `session` on the `Section` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Session" AS ENUM ('C', 'A', 'L', 'T');

-- DropIndex
DROP INDEX "Section_code_idx";

-- AlterTable
ALTER TABLE "Section" DROP COLUMN "number",
DROP COLUMN "code",
ADD COLUMN     "code" INTEGER NOT NULL,
DROP COLUMN "session",
ADD COLUMN     "session" "Session" NOT NULL;
