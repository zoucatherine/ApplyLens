/*
  Warnings:

  - The `source` column on the `applications` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "applications" DROP COLUMN "source",
ADD COLUMN     "source" "ApplicationSource";
