import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_page_view_times_bucket" AS ENUM('ate10', 'ate30', 'ate60', 'ate180', 'mais180');
  CREATE TABLE "page_view_times" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"day" varchar NOT NULL,
  	"path" varchar NOT NULL,
  	"bucket" "enum_page_view_times_bucket" NOT NULL,
  	"visits" numeric DEFAULT 0,
  	"seconds" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "page_view_times_id" integer;
  CREATE INDEX "page_view_times_day_idx" ON "page_view_times" USING btree ("day");
  CREATE INDEX "page_view_times_updated_at_idx" ON "page_view_times" USING btree ("updated_at");
  CREATE INDEX "page_view_times_created_at_idx" ON "page_view_times" USING btree ("created_at");
  CREATE UNIQUE INDEX "day_path_bucket_idx" ON "page_view_times" USING btree ("day","path","bucket");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_page_view_times_fk" FOREIGN KEY ("page_view_times_id") REFERENCES "public"."page_view_times"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_page_view_times_id_idx" ON "payload_locked_documents_rels" USING btree ("page_view_times_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "page_view_times" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "page_view_times" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_page_view_times_fk";
  
  DROP INDEX "payload_locked_documents_rels_page_view_times_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "page_view_times_id";
  DROP TYPE "public"."enum_page_view_times_bucket";`)
}
