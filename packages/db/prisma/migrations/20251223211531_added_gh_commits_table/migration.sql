-- CreateTable
CREATE TABLE "registry_item_commits" (
    "id" SERIAL NOT NULL,
    "item_id" INTEGER,
    "commit_sha" TEXT,
    "message" TEXT,
    "url" TEXT,
    "date" TIMESTAMP(3),

    CONSTRAINT "registry_item_commits_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "registry_item_commits" ADD CONSTRAINT "registry_item_commits_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "registries_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;
