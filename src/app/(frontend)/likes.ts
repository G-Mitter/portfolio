'use server'

/**
 * Server Action do coração: curte ou descurte um post.
 * Roda no servidor, como o formulário de contato, então o navegador nunca
 * fala direto com o banco.
 */
import { cookies } from 'next/headers'
import { getPayload, type Where } from 'payload'

import config from '@/payload.config'
import {
  isVisitorId,
  MAX_LIKES_PER_HOUR,
  newVisitorId,
  VISITOR_COOKIE,
  VISITOR_MAX_AGE,
} from '@/lib/likes'

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
    visitor = newVisitorId()
    cookieStore.set(VISITOR_COOKIE, visitor, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: VISITOR_MAX_AGE,
    })
  }

  const mine: Where = {
    and: [{ project: { equals: project.id } }, { visitor: { equals: visitor } }],
  }
  const existing = await payload.count({ collection: 'likes', where: mine })

  if (existing.totalDocs > 0) {
    // Já tinha curtido: o clique desfaz, como no Instagram.
    await payload.delete({ collection: 'likes', where: mine })
  } else {
    const lastHour = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    const recent = await payload.count({
      collection: 'likes',
      where: { createdAt: { greater_than: lastHour } },
    })
    if (recent.totalDocs < MAX_LIKES_PER_HOUR) {
      try {
        await payload.create({ collection: 'likes', data: { project: project.id, visitor } })
      } catch {
        // Dois cliques ao mesmo tempo: o banco recusa a segunda curtida (índice único).
        // A primeira já valeu, então seguimos e devolvemos o estado real.
      }
    }
  }

  const [count, liked] = await Promise.all([
    payload.count({ collection: 'likes', where: { project: { equals: project.id } } }),
    payload.count({ collection: 'likes', where: mine }),
  ])
  return { liked: liked.totalDocs > 0, count: count.totalDocs }
}
