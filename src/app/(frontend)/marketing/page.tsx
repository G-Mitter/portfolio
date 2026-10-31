import type { Metadata } from 'next'
import { headers } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { DownloadAll } from '@/components/DownloadAll'
import { Card } from '@/components/ui/card'
import { dayKey } from '@/lib/dashboard'
import { deliveryFolder, isExpired, loadPosts, monthGrid, parseMonth, shiftMonth, type Post } from '@/lib/marketing'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Marketing', robots: { index: false, follow: false } }

const WEEKDAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']

/** /marketing: calendário das postagens (eventos "[Post]" do Google Agenda), só com login do /admin. */
export default async function MarketingPage({ searchParams }: { searchParams: Promise<{ mes?: string }> }) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) redirect('/admin/login?redirect=/marketing')

  const month = parseMonth((await searchParams).mes)
  const [{ posts, error }, files] = await Promise.all([
    loadPosts(),
    payload.find({ collection: 'marketing-files', limit: 1000, depth: 0, pagination: false, select: { filename: true, url: true, pasta: true } }),
  ])
  // Arquivos enviados ao site, por pasta da entrega: cada post mostra os da sua pasta.
  const filesByFolder = new Map<string, typeof files.docs>()
  for (const f of files.docs) filesByFolder.set(f.pasta, [...(filesByFolder.get(f.pasta) ?? []), f])
  // Depois de 5 dias da data o post sai da tela (e a rotina diária apaga os arquivos).
  const monthPosts = posts.filter((p) => p.day.startsWith(month) && !isExpired(p))
  const byDay = new Map<string, Post[]>()
  for (const p of monthPosts) byDay.set(p.day, [...(byDay.get(p.day) ?? []), p])
  const today = dayKey(new Date())
  const [y, m] = month.split('-').map(Number)
  const monthName = new Date(Date.UTC(y, m - 1, 15)).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric', timeZone: 'UTC' })
  const title = monthName[0].toUpperCase() + monthName.slice(1) // "Novembro de 2026"

  return (
    <>
      <header className="dash-head">
        <h1>Marketing</h1>
        <p>
          Postagens marcadas com [Post] na sua agenda do Google. Mudou lá, muda aqui. <Link href="/dashboard">Dashboard</Link>
        </p>
        <nav className="dash-periods" aria-label="Mês">
          <Link href={`/marketing?mes=${shiftMonth(month, -1)}`}>← Anterior</Link>
          <span className="mkt-month">{title}</span>
          <Link href={`/marketing?mes=${shiftMonth(month, 1)}`}>Próximo →</Link>
        </nav>
      </header>

      {error && <Card className="dash-box"><p className="dash-help">{error}</p></Card>}

      <Card className="dash-box">
        <table className="mkt-cal">
          <thead><tr>{WEEKDAYS.map((d) => <th key={d}>{d}</th>)}</tr></thead>
          <tbody>
            {monthGrid(month).map((week, i) => (
              <tr key={i}>
                {week.map((day, j) => (
                  <td key={j} className={day === today ? 'today' : undefined}>
                    {day && (
                      <>
                        <span className="mkt-day">{Number(day.slice(8))}</span>
                        {byDay.get(day)?.map((p) => (
                          <a key={p.start.getTime() + p.title} href={`#${anchor(p)}`} className={`mkt-chip mkt-${p.rede}`} title={p.title}>
                            {p.time} {p.formato}
                          </a>
                        ))}
                      </>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card className="dash-box">
        <h2>Postagens do mês</h2>
        {monthPosts.length === 0 ? (
          <p className="dash-help">Nenhuma postagem neste mês.</p>
        ) : (
          <ul className="mkt-list">
            {monthPosts.map((p) => (
              <li key={p.start.getTime() + p.title} id={anchor(p)}>
                <b>{p.start.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit', timeZone: 'America/Sao_Paulo' })} {p.time}</b>
                <span className={`mkt-chip mkt-${p.rede}`}>{p.rede} · {p.formato}</span>
                <span className={`mkt-status mkt-${p.status}`}>{p.status}</span>
                <span>{p.title}</span>
                {p.arquivo && <small>Arquivo: {p.arquivo}</small>}
                {p.legenda && <small>Legenda: {p.legenda}</small>}
                {(filesByFolder.get(deliveryFolder(p))?.length ?? 0) > 0 && (
                  <span className="mkt-files">
                    {(filesByFolder.get(deliveryFolder(p))?.length ?? 0) > 1 && <DownloadAll />}
                    {filesByFolder.get(deliveryFolder(p))?.map((f) => (
                      <a key={f.id} href={f.url ?? '#'} download={f.filename ?? undefined}>⬇ {f.filename}</a>
                    ))}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  )
}

const anchor = (p: Post) => `post-${p.start.getTime()}-${p.rede}`
