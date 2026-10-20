import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "page_view_days" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"path" varchar NOT NULL,
  	"day" varchar NOT NULL,
  	"views" numeric DEFAULT 0,
  	"visitors" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "page_view_days_id" integer;
  CREATE INDEX "page_view_days_day_idx" ON "page_view_days" USING btree ("day");
  CREATE INDEX "page_view_days_updated_at_idx" ON "page_view_days" USING btree ("updated_at");
  CREATE INDEX "page_view_days_created_at_idx" ON "page_view_days" USING btree ("created_at");
  CREATE UNIQUE INDEX "path_day_idx" ON "page_view_days" USING btree ("path","day");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_page_view_days_fk" FOREIGN KEY ("page_view_days_id") REFERENCES "public"."page_view_days"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_page_view_days_id_idx" ON "payload_locked_documents_rels" USING btree ("page_view_days_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "page_view_days" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "page_view_days" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_page_view_days_fk";
  
  DROP INDEX "payload_locked_documents_rels_page_view_days_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "page_view_days_id";`)
}
