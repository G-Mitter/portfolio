import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects" ADD COLUMN "demo_video_id" integer;
  ALTER TABLE "projects" ADD COLUMN "demo_video_tall_id" integer;
  ALTER TABLE "_projects_v" ADD COLUMN "version_demo_video_id" integer;
  ALTER TABLE "_projects_v" ADD COLUMN "version_demo_video_tall_id" integer;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_demo_video_id_media_id_fk" FOREIGN KEY ("demo_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_demo_video_tall_id_media_id_fk" FOREIGN KEY ("demo_video_tall_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_demo_video_id_media_id_fk" FOREIGN KEY ("version_demo_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_demo_video_tall_id_media_id_fk" FOREIGN KEY ("version_demo_video_tall_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "projects_demo_video_idx" ON "projects" USING btree ("demo_video_id");
  CREATE INDEX "projects_demo_video_tall_idx" ON "projects" USING btree ("demo_video_tall_id");
  CREATE INDEX "_projects_v_version_version_demo_video_idx" ON "_projects_v" USING btree ("version_demo_video_id");
  CREATE INDEX "_projects_v_version_version_demo_video_tall_idx" ON "_projects_v" USING btree ("version_demo_video_tall_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects" DROP CONSTRAINT "projects_demo_video_id_media_id_fk";
  
  ALTER TABLE "projects" DROP CONSTRAINT "projects_demo_video_tall_id_media_id_fk";
  
  ALTER TABLE "_projects_v" DROP CONSTRAINT "_projects_v_version_demo_video_id_media_id_fk";
  
  ALTER TABLE "_projects_v" DROP CONSTRAINT "_projects_v_version_demo_video_tall_id_media_id_fk";
  
  DROP INDEX "projects_demo_video_idx";
  DROP INDEX "projects_demo_video_tall_idx";
  DROP INDEX "_projects_v_version_version_demo_video_idx";
  DROP INDEX "_projects_v_version_version_demo_video_tall_idx";
  ALTER TABLE "projects" DROP COLUMN "demo_video_id";
  ALTER TABLE "projects" DROP COLUMN "demo_video_tall_id";
  ALTER TABLE "_projects_v" DROP COLUMN "version_demo_video_id";
  ALTER TABLE "_projects_v" DROP COLUMN "version_demo_video_tall_id";`)
}
