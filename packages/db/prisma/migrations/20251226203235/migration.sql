/*
  Warnings:

  - Made the column `name` on table `registries` required. This step will fail if there are existing NULL values in that column.
  - Made the column `url` on table `registries` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "registries" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "url" SET NOT NULL;
