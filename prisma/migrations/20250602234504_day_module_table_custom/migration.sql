/*
  Warnings:

  - You are about to drop the `_DayToModule` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_DayToModule" DROP CONSTRAINT "_DayToModule_A_fkey";

-- DropForeignKey
ALTER TABLE "_DayToModule" DROP CONSTRAINT "_DayToModule_B_fkey";

-- DropTable
DROP TABLE "_DayToModule";

-- CreateTable
CREATE TABLE "DayModule" (
    "dayCode" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,

    CONSTRAINT "DayModule_pkey" PRIMARY KEY ("dayCode","moduleId")
);

-- AddForeignKey
ALTER TABLE "DayModule" ADD CONSTRAINT "DayModule_dayCode_fkey" FOREIGN KEY ("dayCode") REFERENCES "Day"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DayModule" ADD CONSTRAINT "DayModule_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
