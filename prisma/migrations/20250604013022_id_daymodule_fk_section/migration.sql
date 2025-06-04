/*
  Warnings:

  - The primary key for the `DayModule` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Module` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Module` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `moduleId` on the `Section` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[dayCode,moduleId]` on the table `DayModule` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `moduleId` on the `DayModule` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `dayModuleId` to the `Section` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DayModule" DROP CONSTRAINT "DayModule_moduleId_fkey";

-- DropForeignKey
ALTER TABLE "Section" DROP CONSTRAINT "Section_moduleId_fkey";

-- AlterTable
ALTER TABLE "DayModule" DROP CONSTRAINT "DayModule_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "moduleId",
ADD COLUMN     "moduleId" INTEGER NOT NULL,
ADD CONSTRAINT "DayModule_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Module" DROP CONSTRAINT "Module_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Module_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Section" DROP COLUMN "moduleId",
ADD COLUMN     "dayModuleId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "DayModule_dayCode_moduleId_key" ON "DayModule"("dayCode", "moduleId");

-- AddForeignKey
ALTER TABLE "DayModule" ADD CONSTRAINT "DayModule_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_dayModuleId_fkey" FOREIGN KEY ("dayModuleId") REFERENCES "DayModule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
