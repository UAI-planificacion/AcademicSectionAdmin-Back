/*
  Warnings:

  - Changed the type of `value` on the `CapacityGroup` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `session` to the `Section` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CapacityValue" AS ENUM ('XS', 'S', 'MS', 'M', 'L', 'LABPCA', 'AUDITORIO');

-- AlterTable
ALTER TABLE "CapacityGroup" DROP COLUMN "value",
ADD COLUMN     "value" "CapacityValue" NOT NULL;

-- AlterTable
ALTER TABLE "Section" ADD COLUMN     "session" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CapacityGroup_value_key" ON "CapacityGroup"("value");

-- CreateIndex
CREATE INDEX "CapacityGroup_value_idx" ON "CapacityGroup"("value");
