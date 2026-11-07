/**
 * Números dos posts do Instagram (API oficial, "Instagram API with Instagram Login").
 * Funções puras para o teste; quem chama a API é a rotina /api/instagram-posts/sincronizar.
 */

import { dayKey } from './dashboard'
import type { Post } from './marketing'

// ponytail: versão fixa da API; a Meta desliga cada versão ~2 anos depois. Trocar aqui quando avisar.
export const IG_API = 'https://graph.instagram.com/v23.0'

/** Por quantos dias depois de publicado o post continua sendo atualizado (depois disso os números quase não mudam). */
export const SYNC_DAYS = 30

export const TIPOS = ['reels', 'carrossel', 'foto', 'video', 'story'] as const
export type Tipo = (typeof TIPOS)[number]

export const TIPO_LABELS: Record<Tipo, string> = { reels: 'Reels', carrossel: 'Carrossel', foto: 'Foto', video: 'Vídeo', story: 'Story' }

/** O que a API devolve em /me/media e /me/stories (só os campos que pedimos). */
export type IgMedia = {
  id: string
  media_type?: string // IMAGE, VIDEO, CAROUSEL_ALBUM
  media_product_type?: string // FEED, REELS, STORY
  permalink?: string
  caption?: string
  timestamp?: string
  thumbnail_url?: string
  media_url?: string
  like_count?: number
  comments_count?: number
}

export const MEDIA_FIELDS = 'id,media_type,media_product_type,permalink,caption,timestamp,thumbnail_url,media_url,like_count,comments_count'

export function toTipo(m: Pick<IgMedia, 'media_type' | 'media_product_type'>): Tipo {
  if (m.media_product_type === 'STORY') return 'story'
  if (m.media_product_type === 'REELS') return 'reels'
  if (m.media_type === 'CAROUSEL_ALBUM') return 'carrossel'
  return m.media_type === 'VIDEO' ? 'video' : 'foto'
}

/** Métricas que a API aceita para cada tipo. Pedir uma que não existe para o tipo faz a API recusar tudo. */
export function insightMetrics(tipo: Tipo): string {
  return tipo === 'story' ? 'reach,views,replies,shares,total_interactions' : 'reach,views,saved,shares,total_interactions'
}

export type Metrics = {
  alcance: number
  visualizacoes: number
  curtidas: number
  comentarios: number
  salvamentos: number
  compartilhamentos: number
  respostas: number
  interacoes: number
}

export const METRIC_KEYS: (keyof Metrics)[] = ['alcance', 'visualizacoes', 'curtidas', 'comentarios', 'salvamentos', 'compartilhamentos', 'respostas', 'interacoes']

const NAMES: Record<string, keyof Metrics> = {
  reach: 'alcance',
  views: 'visualizacoes',
  saved: 'salvamentos',
  shares: 'compartilhamentos',
  replies: 'respostas',
  total_interactions: 'interacoes',
}

/** Resposta de /{id}/insights + curtidas/comentários do próprio post -> números do site. */
export function parseInsights(body: unknown, media: Pick<IgMedia, 'like_count' | 'comments_count'>): Metrics {
  const out: Metrics = { alcance: 0, visualizacoes: 0, curtidas: media.like_count ?? 0, comentarios: media.comments_count ?? 0, salvamentos: 0, compartilhamentos: 0, respostas: 0, interacoes: 0 }
  const data = (body as { data?: { name?: string; values?: { value?: unknown }[]; total_value?: { value?: unknown } }[] })?.data ?? []
  for (const m of data) {
    const key = m.name && NAMES[m.name]
    const value = Number(m.values?.[0]?.value ?? m.total_value?.value ?? 0)
    if (key && Number.isFinite(value)) out[key] = value
  }
  return out
}

/** Só posts dos últimos SYNC_DAYS dias são atualizados. */
export function isRecent(timestamp: string | undefined, now = new Date()): boolean {
  const t = Date.parse(timestamp ?? '')
  return Number.isFinite(t) && now.getTime() - t <= SYNC_DAYS * 24 * 60 * 60 * 1000
}

/** O formato escrito no evento [Post] ("reels", "carrossel", "story", "foto"...) no mesmo nome do tipo. */
const formatoTipo = (formato: string): string => (formato.startsWith('stor') ? 'story' : formato.startsWith('carross') ? 'carrossel' : formato)

/**
 * O evento [Post] do Instagram do mesmo dia (Brasília) e do mesmo formato: é dele que vem a campanha.
 * Se o dia tiver um único post do Instagram, ele vale mesmo com o formato diferente.
 */
export function matchEvent(media: { tipo: Tipo; publicadoEm: string }, events: Post[]): Post | undefined {
  const day = dayKey(new Date(media.publicadoEm))
  const sameDay = events.filter((e) => e.rede === 'instagram' && e.day === day)
  return sameDay.find((e) => formatoTipo(e.formato) === media.tipo) ?? (sameDay.length === 1 ? sameDay[0] : undefined)
}

/** O post do Instagram que corresponde a um evento [Post] (o caminho inverso, para mostrar os números no /marketing). */
export function matchMedia<T extends { tipo: Tipo; publicadoEm: string }>(event: Post, media: T[], events: Post[]): T | undefined {
  return media.find((m) => matchEvent(m, events) === event)
}

export type Row = { posts: number } & Metrics

/** Soma os números por grupo (formato, campanha...), do maior alcance para o menor. */
export function summarize<T extends Partial<Record<keyof Metrics, number | null>>>(items: T[], key: (item: T) => string): [string, Row][] {
  const groups = new Map<string, Row>()
  for (const item of items) {
    const k = key(item)
    const row = groups.get(k) ?? ({ posts: 0, ...Object.fromEntries(METRIC_KEYS.map((m) => [m, 0])) } as Row)
    row.posts++
    for (const m of METRIC_KEYS) row[m] += item[m] ?? 0
    groups.set(k, row)
  }
  return [...groups].sort((a, b) => b[1].alcance - a[1].alcance)
}

/** O token dura 60 dias; renovamos se tiver mais de 7 (a API só renova tokens com mais de 24 h). */
export function needsRefresh(renovadoEm: string | null | undefined, now = new Date()): boolean {
  const t = Date.parse(renovadoEm ?? '')
  return !Number.isFinite(t) || now.getTime() - t > 7 * 24 * 60 * 60 * 1000
}
