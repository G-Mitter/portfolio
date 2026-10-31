import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "marketing_files" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"pasta" varchar NOT NULL,
  	"prefix" varchar DEFAULT '',
  	"_objectkey" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  ALTER TABLE "users" ADD COLUMN "enable_a_p_i_key" boolean;
  ALTER TABLE "users" ADD COLUMN "api_key" varchar;
  ALTER TABLE "users" ADD COLUMN "api_key_index" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "marketing_files_id" integer;
  CREATE INDEX "marketing_files_pasta_idx" ON "marketing_files" USING btree ("pasta");
  CREATE INDEX "marketing_files_updated_at_idx" ON "marketing_files" USING btree ("updated_at");
  CREATE INDEX "marketing_files_created_at_idx" ON "marketing_files" USING btree ("created_at");
  CREATE UNIQUE INDEX "marketing_files_filename_idx" ON "marketing_files" USING btree ("filename");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_marketing_files_fk" FOREIGN KEY ("marketing_files_id") REFERENCES "public"."marketing_files"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_marketing_files_id_idx" ON "payload_locked_documents_rels" USING btree ("marketing_files_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "marketing_files" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "marketing_files" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_marketing_files_fk";
  
  DROP INDEX "payload_locked_documents_rels_marketing_files_id_idx";
  ALTER TABLE "users" DROP COLUMN "enable_a_p_i_key";
  ALTER TABLE "users" DROP COLUMN "api_key";
  ALTER TABLE "users" DROP COLUMN "api_key_index";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "marketing_files_id";`)
}
