PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_workflows` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`data` text,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
INSERT INTO `__new_workflows`("id", "name", "description", "data", "created_at", "updated_at") SELECT "id", "name", "description", "data", "created_at", "updated_at" FROM `workflows`;--> statement-breakpoint
DROP TABLE `workflows`;--> statement-breakpoint
ALTER TABLE `__new_workflows` RENAME TO `workflows`;--> statement-breakpoint
PRAGMA foreign_keys=ON;