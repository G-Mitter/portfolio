'use server'

/**
 * Server Action do coração: curte ou descurte um post.
 * Roda no servidor, como o formulário de contato, então o navegador nunca
 * fala direto com o banco.
 */
import { cookies } from 'next/headers'
import { getPayload, type Where } from 'payload'

import config from '@/payload.config'
import { isVisitorId, VISITOR_COOKIE } from '@/lib/likes'

export type LikeState = { liked: boolean; count: number }

export async function toggleLike(slug: string): Promise<LikeState | null> {
  if (typeof slug !== 'string' || !/^[a-z0-9-]{1,100}$/.test(slug)) return null

  const payload = await getPayload({ config })
  // overrideAccess: false = só projetos publicados, como um visitante enxerga.
  const { docs } = await payload.find({
    collection: 'projects',
    where: { slug: { equals: slug } },
    depth: 0,
    limit: 1,
    overrideAccess: false,
    select: { slug: true },
  })
  const project = docs[0]
  if (!project) return null

  // Primeira curtida deste navegador: criamos o código anônimo e guardamos no cookie.
  // httpOnly = o JavaScript da página não consegue ler; só o servidor.
  const cookieStore = await cookies()
  let visitor = cookieStore.get(VISITOR_COOKIE)?.value
  if (!isVisitorId(visitor)) {
    visitor = crypto.randomUUID()
    cookieStore.set(VISITOR_COOKIE, visitor, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 365, // 1 ano: a curtida continua marcada quando a pessoa volta
    })
  }

  const mine: Where = {
    and: [{ project: { equals: project.id } }, { visitor: { equals: visitor } }],
  }
  // Tenta apagar a curtida deste navegador. Se apagou alguma, era um "descurtir".
  const removed = await payload.delete({ collection: 'likes', where: mine })
  let liked = false

  if (removed.docs.length === 0) {
    const lastHour = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    const recent = await payload.count({
      collection: 'likes',
      where: { createdAt: { greater_than: lastHour } },
    })
    // ponytail: teto global de 300/hora para um robô não encher o banco; trocar por limite por IP se virar problema.
    if (recent.totalDocs < 300) {
      // Dois cliques ao mesmo tempo: o índice único recusa o segundo, e a curtida do primeiro vale.
      await payload
        .create({ collection: 'likes', data: { project: project.id, visitor } })
        .catch(() => {})
      liked = true
    }
  }

  const { totalDocs: count } = await payload.count({
    collection: 'likes',
    where: { project: { equals: project.id } },
  })
  return { liked, count }
}
