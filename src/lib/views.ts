import { sql, type PostgresAdapter } from '@payloadcms/db-postgres'
import type { Payload } from 'payload'

import { matchPage } from '@/lib/pagePath'
import type { Place } from '@/lib/place'
import type { Source } from '@/lib/source'
import { bucketFor } from '@/lib/timing'

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

/** Soma 1 visita na origem de hoje (mesmo comando único de `addView`, no dia de Brasília). */
export async function addSource(payload: Payload, source: Source) {
  await (payload.db as unknown as PostgresAdapter).drizzle.execute(sql`
    insert into page_view_sources (day, source, visits)
    values (to_char(now() at time zone 'America/Sao_Paulo', 'YYYY-MM-DD'), ${source}, 1)
    on conflict (day, source) do update set
      visits = page_view_sources.visits + 1,
      updated_at = now()`)
}

/** Soma 1 visita no lugar de hoje (mesmo comando único; coordenadas ficam as da primeira visita do dia). */
export async function addPlace(payload: Payload, place: Place) {
  await (payload.db as unknown as PostgresAdapter).drizzle.execute(sql`
    insert into page_view_places (day, country, city, lat, lon, visits)
    values (to_char(now() at time zone 'America/Sao_Paulo', 'YYYY-MM-DD'), ${place.country}, ${place.city}, ${place.lat}, ${place.lon}, 1)
    on conflict (day, country, city) do update set
      visits = page_view_places.visits + 1,
      updated_at = now()`)
}

/**
 * A página existe e pode ser contada? A inicial e o portfólio sempre; um projeto só se estiver publicado
 * (overrideAccess: false = como um visitante enxerga).
 */
export async function isCountablePage(payload: Payload, path: string): Promise<boolean> {
  const page = matchPage(path)
  if (!page) return false
  if (!page.slug) return true
  const { totalDocs } = await payload.count({
    collection: 'projects',
    where: { slug: { equals: page.slug } },
    overrideAccess: false,
  })
  return totalDocs > 0
}

/** Soma 1 visita e os segundos na faixa de tempo de hoje. */
export async function addTime(payload: Payload, path: string, seconds: number) {
  await (payload.db as unknown as PostgresAdapter).drizzle.execute(sql`
    insert into page_view_times (day, path, bucket, visits, seconds)
    values (to_char(now() at time zone 'America/Sao_Paulo', 'YYYY-MM-DD'), ${path}, ${bucketFor(seconds)}, 1, ${seconds})
    on conflict (day, path, bucket) do update set
      visits = page_view_times.visits + 1,
      seconds = page_view_times.seconds + excluded.seconds,
      updated_at = now()`)
}
