-- AlterTable
ALTER TABLE "Section" ALTER COLUMN "correctedRegistrants" DROP NOT NULL,
ALTER COLUMN "realRegistrants" DROP NOT NULL,
ALTER COLUMN "plannedBuilding" DROP NOT NULL,
ALTER COLUMN "session" DROP NOT NULL,
ALTER COLUMN "size" DROP NOT NULL;
