-- DropForeignKey
ALTER TABLE "Section" DROP CONSTRAINT "Section_professorId_fkey";

-- AlterTable
ALTER TABLE "Section" ALTER COLUMN "professorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "Professor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
