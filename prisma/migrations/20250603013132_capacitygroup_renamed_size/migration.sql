/*
  Warnings:

  - You are about to drop the column `capacityGroupId` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the `CapacityGroup` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `sizeId` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `size` on the `Section` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `talla` on the `Section` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "CapacityValue" ADD VALUE 'CORE';
ALTER TYPE "CapacityValue" ADD VALUE 'LABRED';
ALTER TYPE "CapacityValue" ADD VALUE 'DIS';
ALTER TYPE "CapacityValue" ADD VALUE 'LABCB';
ALTER TYPE "CapacityValue" ADD VALUE 'LABCC';
ALTER TYPE "CapacityValue" ADD VALUE 'LABPROC';

-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_capacityGroupId_fkey";

-- AlterTable
ALTER TABLE "Period" ALTER COLUMN "status" SET DEFAULT 'InProgress';

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "capacityGroupId",
ADD COLUMN     "sizeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Section" DROP COLUMN "size",
ADD COLUMN     "size" "CapacityValue" NOT NULL,
DROP COLUMN "talla",
ADD COLUMN     "talla" "CapacityValue" NOT NULL;

-- DropTable
DROP TABLE "CapacityGroup";

-- CreateTable
CREATE TABLE "Size" (
    "id" TEXT NOT NULL,
    "value" "CapacityValue" NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "Size_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Size_value_key" ON "Size"("value");

-- CreateIndex
CREATE INDEX "Size_value_idx" ON "Size"("value");

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "Size"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
