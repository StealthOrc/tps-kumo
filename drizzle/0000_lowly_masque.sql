CREATE TABLE `tps` (
	`uuid` text NOT NULL,
	`timestamp` integer NOT NULL,
	`tps` real NOT NULL,
	`world` text DEFAULT '00000000-0000-0000-0000-000000000000' NOT NULL,
	FOREIGN KEY (`world`) REFERENCES `worlds`(`uuid`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tps_uuid_unique` ON `tps` (`uuid`);--> statement-breakpoint
CREATE TABLE `worlds` (
	`uuid` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `worlds_uuid_unique` ON `worlds` (`uuid`);