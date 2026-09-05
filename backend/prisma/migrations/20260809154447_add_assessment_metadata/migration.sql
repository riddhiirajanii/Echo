/*
  Warnings:

  - Added the required column `assessmentType` to the `Assessment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Assessment"
ADD COLUMN "assessmentType" TEXT,
ADD COLUMN "responses" JSONB;

UPDATE "Assessment"
SET "assessmentType" = 'legacy';

ALTER TABLE "Assessment"
ALTER COLUMN "assessmentType" SET NOT NULL;