import { head } from '@vercel/blob'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { CopyText, DownloadAll } from '@/components/MarketingActions'
import { Card } from '@/components/ui/card'
import { dayKey } from '@/lib/dashboard'
import { deliveryFolder, isExpired, loadPosts, monthGrid, parseMonth, shiftMonth, type Post } from '@/lib/marketing'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Marketing', robots: { index: false, follow: false } }

const WEEKDAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']

/** /marketing: calendário das postagens (eventos "[Post]" do Google Agenda), só com login do /admin. */
export default async function MarketingPage({ searchParams }: { searchParams: Promise<{ mes?: string; dia?: string }> }) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) redirect('/admin/login?redirect=/marketing')

  const { mes, dia } = await searchParams
  const month = parseMonth(mes)
  const day = dia && /^\d{4}-\d{2}-\d{2}$/.test(dia) && dia.startsWith(month) ? dia : null
  const [{ posts, error }, files] = await Promise.all([
    loadPosts(),
    payload.find({ collection: 'marketing-files', limit: 1000, depth: 0, pagination: false, select: { filename: true, url: true, pasta: true, prefix: true, mimeType: true } }),
  ])
  // Legendas (.md/.txt) aparecem como texto com botão de copiar, em vez de arquivo para baixar.
  const texts = new Map<number, string>()
  await Promise.all(
    files.docs
      .filter((f) => f.mimeType?.startsWith('text/') && f.filename)
      .map(async (f) => {
        try {
          const { url } = await head(f.prefix ? `${f.prefix}/${f.filename}` : f.filename!)
          const res = await fetch(url, { cache: 'no-store' })
          if (res.ok) texts.set(f.id, await res.text())
        } catch {
          // sem Blob (no seu computador) ou falhou: fica como arquivo para baixar
        }
      }),
  )
  // Arquivos enviados ao site, por pasta da entrega: cada post mostra os da sua pasta.
  const filesByFolder = new Map<string, typeof files.docs>()
  for (const f of files.docs) filesByFolder.set(f.pasta, [...(filesByFolder.get(f.pasta) ?? []), f])
  // Depois de 5 dias da data o post sai da tela (e a rotina diária apaga os arquivos).
  const monthPosts = posts.filter((p) => p.day.startsWith(month) && !isExpired(p))
  const downloads = (p: Post) => (filesByFolder.get(deliveryFolder(p)) ?? []).filter((f) => !texts.has(f.id))
  const listed = day ? monthPosts.filter((p) => p.day === day) : monthPosts
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
                {week.map((d, j) => (
                  <td key={j} className={[d === today && 'today', d === day && 'selected'].filter(Boolean).join(' ') || undefined}>
                    {d && (
                      <>
                        <Link href={`/marketing?mes=${month}&dia=${d}#postagens`} className="mkt-day">{Number(d.slice(8))}</Link>
                        {byDay.get(d)?.map((p) => (
                          <a key={p.start.getTime() + p.title} href={`/marketing?mes=${month}&dia=${d}#${anchor(p)}`} className={`mkt-chip mkt-${p.rede}`} title={p.title}>
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
        <h2 id="postagens">
          {day ? `Postagens de ${day.slice(8)}/${day.slice(5, 7)}` : 'Postagens do mês'}
          {day && <Link href={`/marketing?mes=${month}`} className="mkt-all-link">Ver o mês inteiro</Link>}
        </h2>
        {listed.length === 0 ? (
          <p className="dash-help">{day ? 'Nenhuma postagem neste dia.' : 'Nenhuma postagem neste mês.'}</p>
        ) : (
          <ul className="mkt-list">
            {listed.map((p) => (
              <li key={p.start.getTime() + p.title} id={anchor(p)}>
                <b>{p.start.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit', timeZone: 'America/Sao_Paulo' })} {p.time}</b>
                <span className={`mkt-chip mkt-${p.rede}`}>{p.rede} · {p.formato}</span>
                <span className={`mkt-status mkt-${p.status}`}>{p.status}</span>
                <span>{p.title}</span>
                {p.arquivo && <small>Arquivo: {p.arquivo}</small>}
                {p.legenda && <small>Legenda: {p.legenda}</small>}
                {(filesByFolder.get(deliveryFolder(p)) ?? []).map((f) => texts.has(f.id) && <CopyText key={f.id} text={texts.get(f.id)!} />)}
                {downloads(p).length > 0 && (
                  <span className="mkt-files">
                    {downloads(p).length > 1 && <DownloadAll />}
                    {downloads(p).map((f) => (
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
