/**
 * /marketing: lê a agenda do Google (endereço secreto iCal) e separa os eventos "[Post] ...".
 * Funções puras para o teste; quem busca o arquivo é a página.
 *
 * Formato do evento (criado pela skill de cronograma):
 *   título:    "[Post] Instagram · Reels · Robô de carga dos caixas"
 *   descrição: uma linha por campo, "rede: instagram", "formato: reels", "arquivo: ...", "legenda: ...", "status: agendado"
 */

import { dayKey } from './dashboard'

export type Post = {
  start: Date
  day: string // "2026-11-03" no horário de Brasília
  time: string // "08:00"
  title: string // "Robô de carga dos caixas"
  rede: string
  formato: string
  status: string
  arquivo: string
  legenda: string
}

const TZ = 'America/Sao_Paulo'

/** "20261103T110000Z" (UTC), "20261103T080000" com TZID, ou "20261103" (dia inteiro). */
function parseDate(value: string): Date | null {
  const m = value.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})(Z?))?$/)
  if (!m) return null
  const [, y, mo, d, h = '00', mi = '00', s = '00', z] = m
  // ponytail: sem "Z" (TZID ou dia inteiro) tratamos como Brasília (-03:00, sem horário de verão desde 2019); outro fuso sairia errado.
  return new Date(`${y}-${mo}-${d}T${h}:${mi}:${s}${z ? 'Z' : '-03:00'}`)
}

const unescape = (v: string) => v.replace(/\\n/gi, '\n').replace(/\\([,;\\])/g, '$1')

/** Lê o texto .ics e devolve só os posts, em ordem de data. Eventos que se repetem entram só na 1ª data. */
export function parsePosts(ics: string): Post[] {
  // Linhas longas vêm "dobradas": continuação começa com espaço ou tab.
  const lines = ics.replace(/\r\n/g, '\n').replace(/\n[ \t]/g, '').split('\n')
  const posts: Post[] = []
  let ev: Record<string, string> | null = null
  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') ev = {}
    else if (line === 'END:VEVENT' && ev) {
      const post = toPost(ev)
      if (post) posts.push(post)
      ev = null
    } else if (ev) {
      const i = line.indexOf(':')
      if (i < 0) continue
      ev[line.slice(0, i).split(';')[0]] = line.slice(i + 1)
    }
  }
  return posts.sort((a, b) => a.start.getTime() - b.start.getTime())
}

function toPost(ev: Record<string, string>): Post | null {
  const summary = unescape(ev.SUMMARY ?? '')
  if (!summary.startsWith('[Post]') || ev.STATUS === 'CANCELLED') return null
  const start = parseDate(ev.DTSTART ?? '')
  if (!start) return null
  const fields: Record<string, string> = {}
  for (const l of unescape(ev.DESCRIPTION ?? '').split('\n')) {
    const m = l.match(/^\s*(\w+)\s*:\s*(.+?)\s*$/)
    if (m) fields[m[1].toLowerCase()] = m[2]
  }
  // "[Post] Instagram · Reels · Título": rede e formato do título valem se faltarem na descrição.
  const parts = summary.slice(6).split('·').map((p) => p.trim())
  return {
    start,
    day: dayKey(start),
    time: new Intl.DateTimeFormat('pt-BR', { timeZone: TZ, hour: '2-digit', minute: '2-digit' }).format(start),
    title: parts.length >= 3 ? parts.slice(2).join(' · ') : parts.join(' · '),
    rede: (fields.rede ?? (parts.length >= 3 ? parts[0] : '')).toLowerCase(),
    formato: (fields.formato ?? (parts.length >= 3 ? parts[1] : '')).toLowerCase(),
    status: (fields.status ?? 'agendado').toLowerCase(),
    arquivo: fields.arquivo ?? '',
    legenda: fields.legenda ?? '',
  }
}

/** "2026-11" válido ou o mês de hoje (Brasília). */
export function parseMonth(value: string | undefined, now = new Date()): string {
  return value && /^\d{4}-(0[1-9]|1[0-2])$/.test(value) ? value : dayKey(now).slice(0, 7)
}

/** Mês anterior/seguinte: "2026-11" + 1 = "2026-12". */
export function shiftMonth(month: string, delta: number): string {
  const [y, m] = month.split('-').map(Number)
  const d = new Date(Date.UTC(y, m - 1 + delta, 1))
  return d.toISOString().slice(0, 7)
}

/** Semanas do mês, de segunda a domingo; null nas casas fora do mês. */
export function monthGrid(month: string): (string | null)[][] {
  const [y, m] = month.split('-').map(Number)
  const days = new Date(Date.UTC(y, m, 0)).getUTCDate()
  const lead = (new Date(Date.UTC(y, m - 1, 1)).getUTCDay() + 6) % 7 // segunda = 0
  const cells: (string | null)[] = Array(lead).fill(null)
  for (let d = 1; d <= days; d++) cells.push(`${month}-${String(d).padStart(2, '0')}`)
  while (cells.length % 7) cells.push(null)
  const weeks: (string | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
  return weeks
}

/** "Marketing/Entregas/2026-10-31-reel-robo-carga/reel.mp4" -> "2026-10-31-reel-robo-carga" (a pasta da entrega). */
export function deliveryFolder(post: Pick<Post, 'arquivo' | 'legenda'>): string {
  const path = (post.arquivo || post.legenda).replace(/\\/g, '/')
  const parts = path.split('/').filter(Boolean)
  const i = parts.indexOf('Entregas')
  return i >= 0 ? (parts[i + 1] ?? '') : (parts.at(-2) ?? '')
}
