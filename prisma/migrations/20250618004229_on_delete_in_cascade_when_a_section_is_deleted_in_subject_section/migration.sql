-- DropForeignKey
ALTER TABLE "SubjectSection" DROP CONSTRAINT "SubjectSection_sectionId_fkey";

-- AddForeignKey
ALTER TABLE "SubjectSection" ADD CONSTRAINT "SubjectSection_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;
