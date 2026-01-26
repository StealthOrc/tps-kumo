PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_tps` (
	`uuid` text PRIMARY KEY NOT NULL,
	`timestamp` integer NOT NULL,
	`tps` real NOT NULL,
	`world` text DEFAULT '00000000-0000-0000-0000-000000000000' NOT NULL,
	FOREIGN KEY (`world`) REFERENCES `worlds`(`uuid`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_tps`("uuid", "timestamp", "tps", "world") SELECT "uuid", "timestamp", "tps", "world" FROM `tps`;--> statement-breakpoint
DROP TABLE `tps`;--> statement-breakpoint
ALTER TABLE `__new_tps` RENAME TO `tps`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `tps_uuid_unique` ON `tps` (`uuid`);