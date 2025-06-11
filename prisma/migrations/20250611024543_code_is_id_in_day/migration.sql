/*
  Warnings:

  - The primary key for the `Day` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `code` on the `Day` table. All the data in the column will be lost.
  - You are about to drop the column `dayCode` on the `DayModule` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[dayId,moduleId]` on the table `DayModule` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dayId` to the `DayModule` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DayModule" DROP CONSTRAINT "DayModule_dayCode_fkey";

-- DropIndex
DROP INDEX "DayModule_dayCode_moduleId_key";

-- AlterTable
ALTER TABLE "Day" DROP CONSTRAINT "Day_pkey",
DROP COLUMN "code",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Day_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "DayModule" DROP COLUMN "dayCode",
ADD COLUMN     "dayId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "DayModule_dayId_moduleId_key" ON "DayModule"("dayId", "moduleId");

-- AddForeignKey
ALTER TABLE "DayModule" ADD CONSTRAINT "DayModule_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "Day"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
