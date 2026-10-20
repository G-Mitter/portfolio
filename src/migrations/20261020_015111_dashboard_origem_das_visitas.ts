import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_page_view_sources_source" AS ENUM('linkedin', 'google', 'instagram', 'whatsapp', 'direto', 'outros');
  CREATE TABLE "page_view_sources" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"day" varchar NOT NULL,
  	"source" "enum_page_view_sources_source" NOT NULL,
  	"visits" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "page_view_sources_id" integer;
  CREATE INDEX "page_view_sources_day_idx" ON "page_view_sources" USING btree ("day");
  CREATE INDEX "page_view_sources_updated_at_idx" ON "page_view_sources" USING btree ("updated_at");
  CREATE INDEX "page_view_sources_created_at_idx" ON "page_view_sources" USING btree ("created_at");
  CREATE UNIQUE INDEX "day_source_idx" ON "page_view_sources" USING btree ("day","source");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_page_view_sources_fk" FOREIGN KEY ("page_view_sources_id") REFERENCES "public"."page_view_sources"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_page_view_sources_id_idx" ON "payload_locked_documents_rels" USING btree ("page_view_sources_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "page_view_sources" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "page_view_sources" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_page_view_sources_fk";
  
  DROP INDEX "payload_locked_documents_rels_page_view_sources_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "page_view_sources_id";
  DROP TYPE "public"."enum_page_view_sources_source";`)
}
