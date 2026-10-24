import type { Metadata } from 'next'
import { headers } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { AutoRefresh } from '@/components/AutoRefresh'
import { LineChart } from '@/components/LineChart'
import { WorldMap } from '@/components/WorldMap'
import { dayKey, daysAgo, formatPercent, formatRatio, lastDays, parsePeriod, periodDays, PERIODS, ratio } from '@/lib/dashboard'
import { likesLabel } from '@/lib/likes'
import { countryName, sumByCity, topCountries } from '@/lib/place'
import { SOURCE_LABELS, SOURCES } from '@/lib/source'
import { BUCKET_LABELS, BUCKETS, formatDuration } from '@/lib/timing'

// Dados novos a cada abertura; nada de cache.
export const dynamic = 'force-dynamic'

// Página só sua: o Google não deve listar.
export const metadata: Metadata = { title: 'Dashboard', robots: { index: false, follow: false } }

/** /dashboard: números do site para você (só com login do /admin). */
export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ dias?: string }> }) {
  const period = parsePeriod((await searchParams).dias)
  const { chart: DAYS, limit } = periodDays(period)
  const payload = await getPayload({ config })

  // Mesmo login do /admin: sem ele, volta para a tela de entrada e depois para cá.
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) redirect('/admin/login?redirect=/dashboard')

  // O gráfico mostra DAYS dias; os cartões usam o período inteiro ("tudo" = totais antigos, sem data).
  const since = daysAgo(DAYS - 1)
  const [pages, perDay, places, times, sources, likes, projects] = await Promise.all([
    payload.find({ collection: 'page-views', limit: 1000, depth: 0, pagination: false }),
    payload.find({
      collection: 'page-view-days',
      where: { day: { greater_than_equal: since } },
      limit: 5000,
      depth: 0,
      pagination: false,
    }),
    payload.find({
      collection: 'page-view-places',
      where: limit ? { day: { greater_than_equal: since } } : {},
      limit: 10000,
      depth: 0,
      pagination: false,
    }),
    payload.find({
      collection: 'page-view-times',
      where: limit ? { day: { greater_than_equal: since } } : {},
      limit: 10000,
      depth: 0,
      pagination: false,
    }),
    payload.find({
      collection: 'page-view-sources',
      where: limit ? { day: { greater_than_equal: since } } : {},
      limit: 5000,
      depth: 0,
      pagination: false,
    }),
    // ponytail: lê todas as curtidas e soma aqui; com milhares delas, trocar por contagem agrupada no SQL.
    payload.find({ collection: 'likes', where: limit ? { createdAt: { greater_than_equal: new Date(`${since}T03:00:00Z`).toISOString() } } : {}, limit: 10000, depth: 0, pagination: false, select: { project: true, createdAt: true } }),
    payload.find({ collection: 'projects', limit: 100, depth: 0, pagination: false, select: { title: true, slug: true } }),
  ])

  // 1) Totais: o que cada cartão mostra.
  // Por página: do período (somando os dias) ou, em "tudo", dos totais antigos (que têm as visitas de antes do gráfico por dia).
  const byPath = new Map<string, { views: number; visitors: number }>()
  if (limit) {
    for (const row of perDay.docs) {
      const cur = byPath.get(row.path) ?? { views: 0, visitors: 0 }
      byPath.set(row.path, { views: cur.views + (row.views ?? 0), visitors: cur.visitors + (row.visitors ?? 0) })
    }
  } else {
    for (const p of pages.docs) byPath.set(p.path, { views: p.views ?? 0, visitors: p.visitors ?? 0 })
  }
  const totalViews = [...byPath.values()].reduce((sum, p) => sum + p.views, 0)
  const totalVisitors = [...byPath.values()].reduce((sum, p) => sum + p.visitors, 0)
  const totalLikes = likes.totalDocs

  // 2) Séries por dia: somamos linhas de páginas diferentes que caem no mesmo dia.
  const viewsByDay = new Map<string, number>()
  for (const row of perDay.docs) viewsByDay.set(row.day, (viewsByDay.get(row.day) ?? 0) + (row.views ?? 0))
  const likesByDay = new Map<string, number>()
  for (const like of likes.docs) {
    const day = dayKey(new Date(like.createdAt))
    likesByDay.set(day, (likesByDay.get(day) ?? 0) + 1)
  }
  const viewsSeries = lastDays(viewsByDay, DAYS)
  const likesSeries = lastDays(likesByDay, DAYS)

  // 3b) Tempo: média = segundos ÷ visitas (geral e por página); faixas = quantas visitas em cada intervalo.
  const timeByPath = new Map<string, { seconds: number; visits: number }>()
  const visitsByBucket = new Map<string, number>()
  for (const row of times.docs) {
    const cur = timeByPath.get(row.path) ?? { seconds: 0, visits: 0 }
    timeByPath.set(row.path, { seconds: cur.seconds + (row.seconds ?? 0), visits: cur.visits + (row.visits ?? 0) })
    visitsByBucket.set(row.bucket, (visitsByBucket.get(row.bucket) ?? 0) + (row.visits ?? 0))
  }
  const allTimes = [...timeByPath.values()]
  const totalTimedVisits = allTimes.reduce((sum, t) => sum + t.visits, 0)
  const averageSeconds = ratio(allTimes.reduce((sum, t) => sum + t.seconds, 0), totalTimedVisits)
  const maxBucket = Math.max(1, ...visitsByBucket.values())

  // 3) Por projeto: junta visitas (page-views, pelo endereço) e curtidas (pelo id do projeto).
  const likesByProject = new Map<number, number>()
  for (const like of likes.docs) {
    const id = typeof like.project === 'number' ? like.project : like.project.id
    likesByProject.set(id, (likesByProject.get(id) ?? 0) + 1)
  }
  const projectRows = projects.docs
    .map((project) => {
      const page = byPath.get(`/projetos/${project.slug}`)
      const visitors = page?.visitors ?? 0
      const count = likesByProject.get(project.id) ?? 0
      const time = timeByPath.get(`/projetos/${project.slug}`)
      return { title: project.title, views: page?.views ?? 0, visitors, likes: count, rate: ratio(count, visitors), avgSeconds: time ? ratio(time.seconds, time.visits) : null }
    })
    .sort((a, b) => b.views - a.views)
  const maxViews = Math.max(1, ...projectRows.map((r) => r.views))

  // 4) Origem: soma as visitas de cada origem no período.
  const visitsBySource = new Map<string, number>()
  for (const row of sources.docs) visitsBySource.set(row.source, (visitsBySource.get(row.source) ?? 0) + (row.visits ?? 0))
  // 5) Lugares: soma os dias de cada cidade; o mapa usa as cidades, o ranking usa os países.
  const placeRows = sumByCity(
    places.docs.map((p) => ({ country: p.country, city: p.city ?? '', lat: p.lat ?? null, lon: p.lon ?? null, visits: p.visits ?? 0 })),
  )
  const countries = topCountries(placeRows)
  const maxCountry = Math.max(1, ...countries.map((c) => c.visits))
  const brazilPlaces = placeRows.filter((p) => p.country === 'BR')
  const totalSourceVisits = [...visitsBySource.values()].reduce((a, b) => a + b, 0)

  return (
    <>
      <AutoRefresh seconds={30} />
      <header className="dash-head">
        <h1>Dashboard</h1>
        <p>Atualiza sozinho a cada 30 segundos. Suas visitas logado no /admin não contam. <Link href="/portfolio">Voltar ao portfólio</Link></p>
        <nav className="dash-periods" aria-label="Período">
          {PERIODS.map((p) => (
            <Link key={p} href={`/dashboard?dias=${p}`} className={p === period ? 'on' : ''} aria-current={p === period ? 'true' : undefined}>
              {p === 'tudo' ? 'Tudo' : `${p} dias`}
            </Link>
          ))}
        </nav>
      </header>

      <section className="dash-cards" aria-label="Totais">
        <div className="dash-card"><b>{totalViews.toLocaleString('pt-BR')}</b><span>Visualizações</span><small>Quantas vezes uma página foi aberta, contando repetições.</small></div>
        <div className="dash-card"><b>{totalVisitors.toLocaleString('pt-BR')}</b><span>{limit ? 'Visitantes por dia (soma)' : 'Visitantes'}</span><small>{limit ? 'Cada navegador conta uma vez por dia e por página; quem volta em outro dia conta de novo.' : 'Quantos navegadores diferentes abriram cada página.'}</small></div>
        <div className="dash-card"><b>{formatRatio(ratio(totalViews, totalVisitors))}</b><span>Visualizações por visitante</span><small>Perto de 1: a pessoa viu e foi embora. Mais alto: ela volta.</small></div>
        <div className="dash-card"><b>{formatDuration(averageSeconds)}</b><span>Tempo médio na página</span><small>Só conta com a aba visível. Poucas visitas longas puxam a média: veja as faixas abaixo.</small></div>
        <div className="dash-card"><b>{totalLikes.toLocaleString('pt-BR')}</b><span>Curtidas</span><small>Quantas pessoas gostaram de um projeto no período.</small></div>
      </section>

      <section className="dash-box">
        <h2>Visualizações por dia</h2>
        <p className="dash-help">Últimos {DAYS} dias{limit ? '' : ' (no filtro Tudo, o gráfico mostra só os 90 mais recentes)'}. Mostra a tendência: um pico depois de um post no LinkedIn indica que o post trouxe gente. O histórico por dia começa na data em que este painel entrou no ar.</p>
        <LineChart data={viewsSeries} label="Visualizações por dia" />
      </section>

      <section className="dash-box">
        <h2>Curtidas por dia</h2>
        <p className="dash-help">Compare com o gráfico de cima: se as visitas sobem e as curtidas não, o projeto chama atenção mas não convence.</p>
        <LineChart data={likesSeries} label="Curtidas por dia" />
      </section>

      <section className="dash-box">
        <h2>De onde vêm as visitas</h2>
        <p className="dash-help">Conta uma vez por visita (a primeira página aberta na aba). Vale a etiqueta do link (<code>?utm_source=linkedin</code>) e, sem ela, o site de onde a pessoa veio. Quem abre pelo app, digita o endereço ou tem a origem escondida aparece em Direto. O histórico começa no deploy deste painel.</p>
        {totalSourceVisits === 0 ? (
          <p className="dash-help">Ainda sem visitas com origem neste período.</p>
        ) : (
          <ul className="dash-sources">
            {SOURCES.map((source) => {
              const visits = visitsBySource.get(source) ?? 0
              return (
                <li key={source}>
                  <span>{SOURCE_LABELS[source]}</span>
                  <span className="dash-bar" style={{ width: `${(visits / totalSourceVisits) * 100}%` }} />
                  <b>{visits} ({formatPercent(ratio(visits, totalSourceVisits))})</b>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <section className="dash-box">
        <h2>Tempo na página</h2>
        <p className="dash-help">Quantas visitas ficaram cada faixa de tempo. Muita gente em &quot;menos de 10 s&quot; indica que a página não prendeu a atenção; visitas de mais de 1 minuto mostram interesse de verdade. O tempo só é enviado quando a pessoa sai da página, então saídas abruptas no celular podem faltar. O histórico começa no deploy deste painel.</p>
        {totalTimedVisits === 0 ? (
          <p className="dash-help">Ainda sem visitas com tempo neste período.</p>
        ) : (
          <ul className="dash-sources">
            {BUCKETS.map((bucket) => {
              const visits = visitsByBucket.get(bucket) ?? 0
              return (
                <li key={bucket}>
                  <span>{BUCKET_LABELS[bucket]}</span>
                  <span className="dash-bar" style={{ width: `${(visits / maxBucket) * 100}%` }} />
                  <b>{visits} ({formatPercent(ratio(visits, totalTimedVisits))})</b>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <section className="dash-box">
        <h2>Mapa das visitas</h2>
        <p className="dash-help">Uma bolha por cidade; quanto maior, mais visitas. A cidade vem do provedor de internet da pessoa e é aproximada (pode apontar para a cidade do provedor). Guardamos só a contagem, nunca o IP. O histórico começa no deploy deste painel.</p>
        {placeRows.length === 0 ? (
          <p className="dash-help">Ainda sem visitas com lugar neste período.</p>
        ) : (
          <>
            <WorldMap places={placeRows} box="0 0 360 180" maxRadius={4} label="Mapa-múndi com as cidades das visitas" />
            {brazilPlaces.length > 0 && (
              <>
                <h3 className="dash-sub">Brasil</h3>
                <WorldMap places={brazilPlaces} box="104 83 46 46" maxRadius={1.6} label="Mapa do Brasil com as cidades das visitas" />
              </>
            )}
            <div className="dash-cols">
              <div>
                <h3 className="dash-sub">Países</h3>
                <ul className="dash-sources">
                  {countries.map((c) => (
                    <li key={c.label}>
                      <span>{c.label}</span>
                      <span className="dash-bar" style={{ width: `${(c.visits / maxCountry) * 100}%` }} />
                      <b>{c.visits}</b>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="dash-sub">Cidades</h3>
                <ul className="dash-sources">
                  {placeRows.slice(0, 8).map((p) => (
                    <li key={`${p.country}|${p.city}`}>
                      <span>{p.city || 'Sem cidade'}</span>
                      <span className="dash-sub-country">{countryName(p.country)}</span>
                      <b>{p.visits}</b>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}
      </section>

      <section className="dash-box">
        <h2>Projetos</h2>
        <p className="dash-help">A barra mostra as visualizações. A taxa de curtida é curtidas ÷ visitantes: como divide pelo público de cada projeto, compara projetos de forma justa, mesmo com audiências diferentes.</p>
        <table className="dash-table">
          <thead><tr><th>Projeto</th><th>Visualizações</th><th>Visitantes</th><th>Curtidas</th><th>Taxa de curtida</th><th>Tempo médio</th></tr></thead>
          <tbody>
            {projectRows.map((row) => (
              <tr key={row.title}>
                <td>{row.title}</td>
                <td><span className="dash-bar" style={{ width: `${(row.views / maxViews) * 100}%` }} />{row.views}</td>
                <td>{row.visitors}</td>
                <td title={likesLabel(row.likes)}>{row.likes}</td>
                <td>{formatPercent(row.rate)}</td>
                <td>{formatDuration(row.avgSeconds)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  )
}
