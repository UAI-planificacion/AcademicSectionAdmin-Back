/*
  Warnings:

  - Changed the type of `session` on the `Section` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Section" DROP COLUMN "session",
ADD COLUMN     "session" TEXT NOT NULL;

-- DropEnum
DROP TYPE "Session";
