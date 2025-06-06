-- DropForeignKey
ALTER TABLE "DayModule" DROP CONSTRAINT "DayModule_moduleId_fkey";

-- AddForeignKey
ALTER TABLE "DayModule" ADD CONSTRAINT "DayModule_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;
