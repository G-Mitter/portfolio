import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import { generateNKeysBetween } from 'payload/shared'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects" ADD COLUMN "_order" varchar;
  ALTER TABLE "_projects_v" ADD COLUMN "version__order" varchar;
  CREATE INDEX "projects__order_idx" ON "projects" USING btree ("_order");
  CREATE INDEX "_projects_v_version_version__order_idx" ON "_projects_v" USING btree ("version__order");`)

  // Os projetos que já existem ganham uma ordem inicial igual à do feed antigo:
  // fixados primeiro, depois do mais recente para o mais antigo.
  const { rows } = await db.execute(
    sql`SELECT "id" FROM "projects" ORDER BY "pinned" DESC NULLS LAST, "date" DESC NULLS LAST, "id" DESC`,
  )
  const keys = generateNKeysBetween(null, null, rows.length)
  for (const [i, row] of rows.entries()) {
    await db.execute(sql`UPDATE "projects" SET "_order" = ${keys[i]} WHERE "id" = ${row.id}`)
    await db.execute(
      sql`UPDATE "_projects_v" SET "version__order" = ${keys[i]} WHERE "parent_id" = ${row.id}`,
    )
  }
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "projects__order_idx";
  DROP INDEX "_projects_v_version_version__order_idx";
  ALTER TABLE "projects" DROP COLUMN "_order";
  ALTER TABLE "_projects_v" DROP COLUMN "version__order";`)
}
