import { sql, type PostgresAdapter } from '@payloadcms/db-postgres'
import type { Payload } from 'payload'

/**
 * Um comando só no banco: cria a linha da página ou soma 1 na que já existe.
 * Assim duas visitas ao mesmo tempo nunca se perdem.
 */
export async function addView(payload: Payload, path: string, firstVisit: boolean) {
  await (payload.db as unknown as PostgresAdapter).drizzle.execute(sql`
    insert into page_views (path, views, visitors) values (${path}, 1, ${firstVisit ? 1 : 0})
    on conflict (path) do update set
      views = page_views.views + 1,
      visitors = page_views.visitors + excluded.visitors,
      updated_at = now()`)
}
