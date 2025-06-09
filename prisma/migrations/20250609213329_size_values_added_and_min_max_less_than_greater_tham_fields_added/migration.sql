-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "SizeValue" ADD VALUE 'XE';
ALTER TYPE "SizeValue" ADD VALUE 'SE';
ALTER TYPE "SizeValue" ADD VALUE 'XXL';

-- AlterTable
ALTER TABLE "Size" ADD COLUMN     "greaterThan" INTEGER,
ADD COLUMN     "lessThan" INTEGER,
ADD COLUMN     "max" INTEGER,
ADD COLUMN     "min" INTEGER;
