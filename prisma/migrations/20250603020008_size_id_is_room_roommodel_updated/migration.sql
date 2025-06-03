/*
  Warnings:

  - The primary key for the `Size` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `value` on the `Size` table. All the data in the column will be lost.
  - Changed the type of `sizeId` on the `Room` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `size` on the `Section` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `talla` on the `Section` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `Size` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "SizeValue" AS ENUM ('XS', 'S', 'MS', 'M', 'L', 'LABPCA', 'AUDITORIO', 'CORE', 'LABRED', 'DIS', 'LABCB', 'LABCC', 'LABPROC');

-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_sizeId_fkey";

-- DropIndex
DROP INDEX "Size_value_idx";

-- DropIndex
DROP INDEX "Size_value_key";

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "sizeId",
ADD COLUMN     "sizeId" "SizeValue" NOT NULL;

-- AlterTable
ALTER TABLE "Section" DROP COLUMN "size",
ADD COLUMN     "size" "SizeValue" NOT NULL,
DROP COLUMN "talla",
ADD COLUMN     "talla" "SizeValue" NOT NULL;

-- AlterTable
ALTER TABLE "Size" DROP CONSTRAINT "Size_pkey",
DROP COLUMN "value",
ADD COLUMN     "isRoom" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "id",
ADD COLUMN     "id" "SizeValue" NOT NULL,
ADD CONSTRAINT "Size_pkey" PRIMARY KEY ("id");

-- DropEnum
DROP TYPE "CapacityValue";

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "Size"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
