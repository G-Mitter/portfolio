import { createHash } from 'crypto'
import type { CollectionConfig, Payload, PayloadHandler } from 'payload'

import { loadPosts } from '@/lib/marketing'
import { IG_API, MEDIA_FIELDS, TIPOS, TIPO_LABELS, insightMetrics, isRecent, matchEvent, needsRefresh, parseInsights, toTipo, type IgMedia, type Metrics } from '@/lib/instagramStats'

const loggedIn = ({ req }: { req: { user?: unknown } }) => Boolean(req.user)
const number = (name: keyof Metrics, label: string) => ({ name, label, type: 'number' as const, defaultValue: 0, admin: { readOnly: true } })

/**
 * Posts publicados no Instagram com os números (alcance, curtidas, salvamentos...).
 * Quem cria e atualiza é a rotina /api/instagram-posts/sincronizar: uma vez por dia (Vercel) para todos os posts
 * dos últimos 30 dias, e de hora em hora (GitHub Actions) só para os stories, que somem da API em 24 h.
 * No /admin dá para trocar a campanha do post; o resto vem do Instagram.
 */
export const InstagramPosts: CollectionConfig = {
  slug: 'instagram-posts',
  labels: { singular: 'Post do Instagram', plural: 'Posts do Instagram' },
  admin: {
    useAsTitle: 'legenda',
    defaultColumns: ['publicadoEm', 'tipo', 'campanha', 'alcance', 'interacoes'],
    description: 'Vêm do Instagram sozinhos, uma vez por dia. Você só escolhe a campanha, se não veio da agenda.',
  },
  defaultSort: '-publicadoEm',
  access: { read: loggedIn, create: () => false, update: loggedIn, delete: loggedIn },
  fields: [
    { name: 'igId', label: 'Id no Instagram', type: 'text', required: true, unique: true, index: true, admin: { readOnly: true } },
    { name: 'tipo', label: 'Tipo', type: 'select', required: true, options: TIPOS.map((t) => ({ label: TIPO_LABELS[t], value: t })), admin: { readOnly: true } },
    { name: 'publicadoEm', label: 'Publicado em', type: 'date', required: true, index: true, admin: { readOnly: true, date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'link', label: 'Link', type: 'text', admin: { readOnly: true } },
    { name: 'legenda', label: 'Legenda', type: 'textarea', admin: { readOnly: true } },
    { name: 'campanha', label: 'Campanha', type: 'relationship', relationTo: 'campaigns', index: true },
    number('alcance', 'Alcance (contas)'),
    number('visualizacoes', 'Visualizações'),
    number('curtidas', 'Curtidas'),
    number('comentarios', 'Comentários'),
    number('salvamentos', 'Salvamentos'),
    number('compartilhamentos', 'Compartilhamentos'),
    number('respostas', 'Respostas (stories)'),
    number('interacoes', 'Interações (total)'),
    { name: 'atualizadoEm', label: 'Números atualizados em', type: 'date', admin: { readOnly: true, position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } } },
  ],
  endpoints: [{ path: '/sincronizar', method: 'get', handler: (req) => sync(req) }],
}

const json = (body: unknown, status = 200) => Response.json(body, { status })
const sha = (text: string) => createHash('sha256').update(text).digest('hex')

/** O token em uso: o renovado (no banco) se ainda for da mesma INSTAGRAM_TOKEN; senão, a própria variável. */
async function currentToken(payload: Payload, env: string) {
  const conn = await payload.findGlobal({ slug: 'instagram-conexao' })
  return conn.token && conn.tokenDoEnv === sha(env) ? { token: conn.token, renovadoEm: conn.renovadoEm } : { token: env, renovadoEm: null }
}

async function sync(req: Parameters<PayloadHandler>[0]) {
  // Mesmo segredo da rotina de limpeza: a Vercel e o GitHub Actions mandam "Authorization: Bearer <CRON_SECRET>".
  if (!process.env.CRON_SECRET || req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`)
    return json({ error: 'Não autorizado.' }, 401)
  const env = process.env.INSTAGRAM_TOKEN
  if (!env) return json({ error: 'Falta a variável INSTAGRAM_TOKEN na Vercel.' }, 400)

  const { payload } = req
  const onlyStories = req.searchParams.get('stories') === '1'
  const conn = await currentToken(payload, env)
  let token = conn.token
  const get = async (path: string, base = IG_API) => {
    const res = await fetch(`${base}${path}${path.includes('?') ? '&' : '?'}access_token=${encodeURIComponent(token)}`, { cache: 'no-store' })
    const body = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(body?.error?.message ?? `O Instagram respondeu ${res.status}`)
    return body
  }

  try {
    if (!onlyStories && needsRefresh(conn.renovadoEm)) {
      try {
        const res = await get('/refresh_access_token?grant_type=ig_refresh_token', 'https://graph.instagram.com')
        token = res.access_token
        await payload.updateGlobal({ slug: 'instagram-conexao', data: { token, tokenDoEnv: sha(env), renovadoEm: new Date().toISOString() } })
      } catch (error) {
        payload.logger.warn({ err: error }, 'Não consegui renovar o token do Instagram; sigo com o atual')
      }
    }

    const stories: IgMedia[] = (await get(`/me/stories?fields=${MEDIA_FIELDS}`)).data ?? []
    const feed: IgMedia[] = onlyStories ? [] : ((await get(`/me/media?fields=${MEDIA_FIELDS}&limit=50`)).data ?? []).filter((m: IgMedia) => isRecent(m.timestamp))
    const [{ posts: events }, campaigns] = await Promise.all([
      loadPosts(), // sem agenda, os posts entram sem campanha
      payload.find({ collection: 'campaigns', limit: 1000, pagination: false, depth: 0, select: { codigo: true } }),
    ])
    const byCode = new Map(campaigns.docs.map((c) => [c.codigo, c.id]))

    const erros: string[] = []
    for (const m of [...stories, ...feed]) {
      const tipo = toTipo(m)
      const publicadoEm = m.timestamp ?? new Date().toISOString()
      let metrics: Metrics | undefined
      try {
        metrics = parseInsights(await get(`/${m.id}/insights?metric=${insightMetrics(tipo)}`), m)
      } catch (error) {
        erros.push(`${m.id}: ${(error as Error).message}`)
      }
      const { docs } = await payload.find({ collection: 'instagram-posts', where: { igId: { equals: m.id } }, limit: 1, depth: 0 })
      const existing = docs[0]
      const code = existing?.campanha ? undefined : matchEvent({ tipo, publicadoEm }, events)?.campanha
      const data = {
        igId: m.id,
        tipo,
        publicadoEm,
        link: m.permalink,
        legenda: m.caption,
        ...(code && byCode.has(code) ? { campanha: byCode.get(code) } : {}),
        ...(metrics ? { ...metrics, atualizadoEm: new Date().toISOString() } : {}),
      }
      if (existing) await payload.update({ collection: 'instagram-posts', id: existing.id, data })
      else await payload.create({ collection: 'instagram-posts', data })
    }

    await payload.updateGlobal({ slug: 'instagram-conexao', data: { ultimaSincronizacao: new Date().toISOString(), ultimoErro: erros.join('\n').slice(0, 1000) || null } })
    return json({ posts: stories.length + feed.length, erros })
  } catch (error) {
    const message = (error as Error).message
    await payload.updateGlobal({ slug: 'instagram-conexao', data: { ultimaSincronizacao: new Date().toISOString(), ultimoErro: message.slice(0, 1000) } })
    return json({ error: message }, 502)
  }
}
