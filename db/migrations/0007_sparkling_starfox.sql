CREATE TABLE `registry_stories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`registry_id` integer NOT NULL,
	`year` integer NOT NULL,
	`first_item_title` text,
	`first_item_date` integer,
	`component_count` integer DEFAULT 0 NOT NULL,
	`block_count` integer DEFAULT 0 NOT NULL,
	`peak_month` text NOT NULL,
	`avg_monthly_pubs` integer DEFAULT 0 NOT NULL,
	`total_items` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`registry_id`) REFERENCES `registries`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `registry_stories_registry_year_idx` ON `registry_stories` (`registry_id`,`year`);
