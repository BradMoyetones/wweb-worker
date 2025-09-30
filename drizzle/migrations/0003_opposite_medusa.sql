PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_workflows` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`data` text,
	`status` text DEFAULT 'DRAFT' NOT NULL,
	`priority` text DEFAULT 'LOW' NOT NULL,
	`started_at` integer,
	`completed_at` integer,
	`last_executed_at` integer,
	`next_scheduled_at` integer,
	`current_step` text,
	`total_steps` integer DEFAULT 0 NOT NULL,
	`completed_steps` integer DEFAULT 0 NOT NULL,
	`created_by` text DEFAULT 'USER' NOT NULL,
	`assigned_to` text DEFAULT 'USER',
	`tags` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`timeout` integer,
	`max_retries` integer DEFAULT 0 NOT NULL,
	`current_retries` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_workflows`("id", "name", "description", "data", "status", "priority", "started_at", "completed_at", "last_executed_at", "next_scheduled_at", "current_step", "total_steps", "completed_steps", "created_by", "assigned_to", "tags", "created_at", "updated_at", "timeout", "max_retries", "current_retries") SELECT "id", "name", "description", "data", "status", "priority", "started_at", "completed_at", "last_executed_at", "next_scheduled_at", "current_step", "total_steps", "completed_steps", "created_by", "assigned_to", "tags", "created_at", "updated_at", "timeout", "max_retries", "current_retries" FROM `workflows`;--> statement-breakpoint
DROP TABLE `workflows`;--> statement-breakpoint
ALTER TABLE `__new_workflows` RENAME TO `workflows`;--> statement-breakpoint
PRAGMA foreign_keys=ON;