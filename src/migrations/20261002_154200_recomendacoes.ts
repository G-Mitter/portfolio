import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "profile_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"photo_id" integer,
  	"name" varchar NOT NULL,
  	"role" varchar,
  	"quote" varchar NOT NULL
  );
  
  ALTER TABLE "profile_testimonials" ADD CONSTRAINT "profile_testimonials_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "profile_testimonials" ADD CONSTRAINT "profile_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "profile_testimonials_order_idx" ON "profile_testimonials" USING btree ("_order");
  CREATE INDEX "profile_testimonials_parent_id_idx" ON "profile_testimonials" USING btree ("_parent_id");
  CREATE INDEX "profile_testimonials_photo_idx" ON "profile_testimonials" USING btree ("photo_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "profile_testimonials" CASCADE;`)
}
