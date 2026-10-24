import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "page_view_places" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"day" varchar NOT NULL,
  	"country" varchar NOT NULL,
  	"city" varchar DEFAULT '',
  	"lat" numeric,
  	"lon" numeric,
  	"visits" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "page_view_places_id" integer;
  CREATE INDEX "page_view_places_day_idx" ON "page_view_places" USING btree ("day");
  CREATE INDEX "page_view_places_updated_at_idx" ON "page_view_places" USING btree ("updated_at");
  CREATE INDEX "page_view_places_created_at_idx" ON "page_view_places" USING btree ("created_at");
  CREATE UNIQUE INDEX "day_country_city_idx" ON "page_view_places" USING btree ("day","country","city");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_page_view_places_fk" FOREIGN KEY ("page_view_places_id") REFERENCES "public"."page_view_places"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_page_view_places_id_idx" ON "payload_locked_documents_rels" USING btree ("page_view_places_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "page_view_places" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "page_view_places" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_page_view_places_fk";
  
  DROP INDEX "payload_locked_documents_rels_page_view_places_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "page_view_places_id";`)
}
