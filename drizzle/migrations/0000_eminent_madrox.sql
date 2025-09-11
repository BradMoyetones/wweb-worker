CREATE TABLE `workflows` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`data` text NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
