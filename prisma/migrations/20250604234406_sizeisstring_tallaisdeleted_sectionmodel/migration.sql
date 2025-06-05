/*
  Warnings:

  - You are about to drop the column `talla` on the `Section` table. All the data in the column will be lost.
  - Changed the type of `size` on the `Section` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Section" DROP COLUMN "talla",
DROP COLUMN "size",
ADD COLUMN     "size" TEXT NOT NULL;
