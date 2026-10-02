import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "likes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"project_id" integer NOT NULL,
  	"visitor" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "likes_id" integer;
  ALTER TABLE "likes" ADD CONSTRAINT "likes_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "likes_project_idx" ON "likes" USING btree ("project_id");
  CREATE INDEX "likes_visitor_idx" ON "likes" USING btree ("visitor");
  CREATE INDEX "likes_updated_at_idx" ON "likes" USING btree ("updated_at");
  CREATE INDEX "likes_created_at_idx" ON "likes" USING btree ("created_at");
  CREATE UNIQUE INDEX "project_visitor_idx" ON "likes" USING btree ("project_id","visitor");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_likes_fk" FOREIGN KEY ("likes_id") REFERENCES "public"."likes"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_likes_id_idx" ON "payload_locked_documents_rels" USING btree ("likes_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "likes" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "likes" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_likes_fk";
  
  DROP INDEX "payload_locked_documents_rels_likes_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "likes_id";`)
}
