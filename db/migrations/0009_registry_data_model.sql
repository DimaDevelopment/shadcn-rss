CREATE TABLE `registry_components` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `registry_id` integer NOT NULL,
  `slug` text NOT NULL,
  `name` text NOT NULL,
  `kind` text DEFAULT 'component' NOT NULL,
  `status` text DEFAULT 'active' NOT NULL,
  `description` text,
  `source_path` text,
  `source_url` text,
  `checksum` text,
  `metadata` text,
  `first_seen_at` integer NOT NULL,
  `last_seen_at` integer NOT NULL,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL,
  CONSTRAINT `registry_components_registry_id_registries_id_fk`
    FOREIGN KEY (`registry_id`) REFERENCES `registries`(`id`)
    ON UPDATE no action
    ON DELETE cascade
);

CREATE UNIQUE INDEX `registry_components_registry_slug_idx`
  ON `registry_components` (`registry_id`, `slug`);

CREATE TABLE `component_snapshots` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `component_id` integer NOT NULL,
  `registry_id` integer NOT NULL,
  `checksum` text NOT NULL,
  `version_label` text,
  `source_commit` text,
  `source_tag` text,
  `source_url` text,
  `files` text,
  `metadata` text,
  `captured_at` integer NOT NULL,
  `created_at` integer NOT NULL,
  CONSTRAINT `component_snapshots_component_id_registry_components_id_fk`
    FOREIGN KEY (`component_id`) REFERENCES `registry_components`(`id`)
    ON UPDATE no action
    ON DELETE cascade,
  CONSTRAINT `component_snapshots_registry_id_registries_id_fk`
    FOREIGN KEY (`registry_id`) REFERENCES `registries`(`id`)
    ON UPDATE no action
    ON DELETE cascade
);

CREATE UNIQUE INDEX `component_snapshots_component_checksum_idx`
  ON `component_snapshots` (`component_id`, `checksum`);

CREATE TABLE `component_changes` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `registry_id` integer NOT NULL,
  `component_id` integer NOT NULL,
  `change_type` text NOT NULL,
  `severity` text DEFAULT 'info' NOT NULL,
  `is_breaking` integer DEFAULT 0 NOT NULL,
  `prev_snapshot_id` integer,
  `next_snapshot_id` integer,
  `summary` text NOT NULL,
  `description` text,
  `diff` text,
  `metadata` text,
  `detected_at` integer NOT NULL,
  `published_at` integer,
  `created_at` integer NOT NULL,
  CONSTRAINT `component_changes_registry_id_registries_id_fk`
    FOREIGN KEY (`registry_id`) REFERENCES `registries`(`id`)
    ON UPDATE no action
    ON DELETE cascade,
  CONSTRAINT `component_changes_component_id_registry_components_id_fk`
    FOREIGN KEY (`component_id`) REFERENCES `registry_components`(`id`)
    ON UPDATE no action
    ON DELETE cascade,
  CONSTRAINT `component_changes_prev_snapshot_id_component_snapshots_id_fk`
    FOREIGN KEY (`prev_snapshot_id`) REFERENCES `component_snapshots`(`id`)
    ON UPDATE no action
    ON DELETE set null,
  CONSTRAINT `component_changes_next_snapshot_id_component_snapshots_id_fk`
    FOREIGN KEY (`next_snapshot_id`) REFERENCES `component_snapshots`(`id`)
    ON UPDATE no action
    ON DELETE set null
);

CREATE INDEX `component_changes_registry_detected_idx`
  ON `component_changes` (`registry_id`, `detected_at`);

CREATE INDEX `component_changes_component_detected_idx`
  ON `component_changes` (`component_id`, `detected_at`);
