/*
  Warnings:

  - Made the column `url` on table `registries_repos` required. This step will fail if there are existing NULL values in that column.
  - Made the column `owner` on table `registries_repos` required. This step will fail if there are existing NULL values in that column.
  - Made the column `repo` on table `registries_repos` required. This step will fail if there are existing NULL values in that column.
  - Made the column `repo_id` on table `registries_repos` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "registries_repos" ALTER COLUMN "url" SET NOT NULL,
ALTER COLUMN "owner" SET NOT NULL,
ALTER COLUMN "repo" SET NOT NULL,
ALTER COLUMN "repo_id" SET NOT NULL;
