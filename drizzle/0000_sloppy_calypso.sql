CREATE TABLE "tps" (
	"uuid" uuid PRIMARY KEY NOT NULL,
	"timestamp" timestamp NOT NULL,
	"tps" double precision NOT NULL,
	"world" uuid DEFAULT '00000000-0000-0000-0000-000000000000' NOT NULL,
	CONSTRAINT "tps_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE "worlds" (
	"uuid" uuid PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	CONSTRAINT "worlds_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
ALTER TABLE "tps" ADD CONSTRAINT "tps_world_worlds_uuid_fk" FOREIGN KEY ("world") REFERENCES "public"."worlds"("uuid") ON DELETE no action ON UPDATE no action;