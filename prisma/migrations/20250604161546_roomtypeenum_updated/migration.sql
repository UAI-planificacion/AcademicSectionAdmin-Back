/*
  Warnings:

  - The values [LABBIO,LABINF,LABPROC] on the enum `RoomType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RoomType_new" AS ENUM ('ROOM', 'AUDITORIO', 'LAB', 'LABPC', 'DIS', 'GARAGE', 'CORE');
ALTER TABLE "Room" ALTER COLUMN "type" TYPE "RoomType_new" USING ("type"::text::"RoomType_new");
ALTER TYPE "RoomType" RENAME TO "RoomType_old";
ALTER TYPE "RoomType_new" RENAME TO "RoomType";
DROP TYPE "RoomType_old";
COMMIT;
