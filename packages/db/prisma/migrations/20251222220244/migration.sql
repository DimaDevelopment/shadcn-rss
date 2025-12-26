/*
  Warnings:

  - You are about to drop the column `content` on the `registries_items_files` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[registry_id,path]` on the table `registries_items_files` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "registries_items_files" DROP COLUMN "content",
ADD COLUMN     "registry_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "registries_items_files_registry_id_path_key" ON "registries_items_files"("registry_id", "path");
