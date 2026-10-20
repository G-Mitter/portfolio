import type { Metadata } from 'next'
import { headers } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { AutoRefresh } from '@/components/AutoRefresh'
import { LineChart } from '@/components/LineChart'
import { dayKey, daysAgo, formatPercent, formatRatio, lastDays, ratio } from '@/lib/dashboard'
import { likesLabel } from '@/lib/likes'

// Dados novos a cada abertura; nada de cache.
export const dynamic = 'force-dynamic'

// Página só sua: o Google não deve listar.
export const metadata: Metadata = { title: 'Dashboard', robots: { index: false, follow: false } }

const DAYS = 30

/** /dashboard: números do site para você (só com login do /admin). */
export default async function DashboardPage() {
  const payload = await getPayload({ config })

  // Mesmo login do /admin: sem ele, volta para a tela de entrada e depois para cá.
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) redirect('/admin/login?redirect=/dashboard')

  const since = daysAgo(DAYS - 1)
  const [pages, perDay, likes, projects] = await Promise.all([
    payload.find({ collection: 'page-views', limit: 1000, depth: 0, pagination: false }),
    payload.find({
      collection: 'page-view-days',
      where: { day: { greater_than_equal: since } },
      limit: 5000,
      depth: 0,
      pagination: false,
    }),
    // ponytail: lê todas as curtidas e soma aqui; com milhares delas, trocar por contagem agrupada no SQL.
    payload.find({ collection: 'likes', limit: 10000, depth: 0, pagination: false, select: { project: true, createdAt: true } }),
    payload.find({ collection: 'projects', limit: 100, depth: 0, pagination: false, select: { title: true, slug: true } }),
  ])

  // 1) Totais: o que cada cartão mostra.
  const totalViews = pages.docs.reduce((sum, p) => sum + (p.views ?? 0), 0)
  const totalVisitors = pages.docs.reduce((sum, p) => sum + (p.visitors ?? 0), 0)
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

  // 3) Por projeto: junta visitas (page-views, pelo endereço) e curtidas (pelo id do projeto).
  const likesByProject = new Map<number, number>()
  for (const like of likes.docs) {
    const id = typeof like.project === 'number' ? like.project : like.project.id
    likesByProject.set(id, (likesByProject.get(id) ?? 0) + 1)
  }
  const pageByPath = new Map(pages.docs.map((p) => [p.path, p]))
  const projectRows = projects.docs
    .map((project) => {
      const page = pageByPath.get(`/projetos/${project.slug}`)
      const visitors = page?.visitors ?? 0
      const count = likesByProject.get(project.id) ?? 0
      return { title: project.title, views: page?.views ?? 0, visitors, likes: count, rate: ratio(count, visitors) }
    })
    .sort((a, b) => b.views - a.views)
  const maxViews = Math.max(1, ...projectRows.map((r) => r.views))

  return (
    <>
      <AutoRefresh seconds={30} />
      <header className="dash-head">
        <h1>Dashboard</h1>
        <p>Atualiza sozinho a cada 30 segundos. Suas visitas logado no /admin não contam. <Link href="/portfolio">Voltar ao portfólio</Link></p>
      </header>

      <section className="dash-cards" aria-label="Totais">
        <div className="dash-card"><b>{totalViews.toLocaleString('pt-BR')}</b><span>Visualizações</span><small>Quantas vezes uma página foi aberta, contando repetições.</small></div>
        <div className="dash-card"><b>{totalVisitors.toLocaleString('pt-BR')}</b><span>Visitantes</span><small>Quantos navegadores diferentes abriram cada página.</small></div>
        <div className="dash-card"><b>{formatRatio(ratio(totalViews, totalVisitors))}</b><span>Visualizações por visitante</span><small>Perto de 1: a pessoa viu e foi embora. Mais alto: ela volta.</small></div>
        <div className="dash-card"><b>{totalLikes.toLocaleString('pt-BR')}</b><span>Curtidas</span><small>Quantas pessoas gostaram de um projeto.</small></div>
      </section>

      <section className="dash-box">
        <h2>Visualizações por dia</h2>
        <p className="dash-help">Últimos {DAYS} dias. Mostra a tendência: um pico depois de um post no LinkedIn indica que o post trouxe gente. O histórico por dia começa na data em que este painel entrou no ar.</p>
        <LineChart data={viewsSeries} label="Visualizações por dia" />
      </section>

      <section className="dash-box">
        <h2>Curtidas por dia</h2>
        <p className="dash-help">Compare com o gráfico de cima: se as visitas sobem e as curtidas não, o projeto chama atenção mas não convence.</p>
        <LineChart data={likesSeries} label="Curtidas por dia" />
      </section>

      <section className="dash-box">
        <h2>Projetos</h2>
        <p className="dash-help">A barra mostra as visualizações. A taxa de curtida é curtidas ÷ visitantes: como divide pelo público de cada projeto, compara projetos de forma justa, mesmo com audiências diferentes.</p>
        <table className="dash-table">
          <thead><tr><th>Projeto</th><th>Visualizações</th><th>Visitantes</th><th>Curtidas</th><th>Taxa de curtida</th></tr></thead>
          <tbody>
            {projectRows.map((row) => (
              <tr key={row.title}>
                <td>{row.title}</td>
                <td><span className="dash-bar" style={{ width: `${(row.views / maxViews) * 100}%` }} />{row.views}</td>
                <td>{row.visitors}</td>
                <td title={likesLabel(row.likes)}>{row.likes}</td>
                <td>{formatPercent(row.rate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  )
}
