ALTER TABLE "tps" ADD COLUMN "uuid" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "tps" ADD CONSTRAINT "tps_id_unique" UNIQUE("id");