/*
  Warnings:

  - You are about to drop the column `name` on the `Module` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Module_name_idx";

-- AlterTable
ALTER TABLE "Module" DROP COLUMN "name",
ADD COLUMN     "difference" TEXT;

-- CreateIndex
CREATE INDEX "Module_code_idx" ON "Module"("code");
