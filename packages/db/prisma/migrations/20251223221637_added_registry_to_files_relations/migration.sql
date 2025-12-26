-- AddForeignKey
ALTER TABLE "registries_items_files" ADD CONSTRAINT "registries_items_files_registry_id_fkey" FOREIGN KEY ("registry_id") REFERENCES "registries"("id") ON DELETE SET NULL ON UPDATE CASCADE;
