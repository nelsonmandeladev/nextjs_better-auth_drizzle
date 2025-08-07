CREATE TABLE "posts" (
	"title" varchar(256) NOT NULL,
	"body" varchar(1000),
	"content" varchar(10000),
	"image_url" varchar(255),
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE UNIQUE INDEX "title_index" ON "posts" USING btree ("title");