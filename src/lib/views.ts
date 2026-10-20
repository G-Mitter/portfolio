import { sql, type PostgresAdapter } from '@payloadcms/db-postgres'
import type { Payload } from 'payload'

/**
 * Um comando só no banco: cria a linha da página ou soma 1 na que já existe.
 * Assim duas visitas ao mesmo tempo nunca se perdem.
 * Soma no total da página e também no dia de hoje (horário de Brasília), para o gráfico do /dashboard.
 */
export async function addView(payload: Payload, path: string, firstVisit: boolean) {
  const { drizzle } = payload.db as unknown as PostgresAdapter
  await drizzle.execute(sql`
    insert into page_view_days (path, day, views, visitors)
    values (${path}, to_char(now() at time zone 'America/Sao_Paulo', 'YYYY-MM-DD'), 1, ${firstVisit ? 1 : 0})
    on conflict (path, day) do update set
      views = page_view_days.views + 1,
      visitors = page_view_days.visitors + excluded.visitors,
      updated_at = now()`)
  await drizzle.execute(sql`
    insert into page_views (path, views, visitors) values (${path}, 1, ${firstVisit ? 1 : 0})
    on conflict (path) do update set
      views = page_views.views + 1,
      visitors = page_views.visitors + excluded.visitors,
      updated_at = now()`)
}
