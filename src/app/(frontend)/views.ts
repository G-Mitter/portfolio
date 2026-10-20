'use server'

import { cookies } from 'next/headers'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { classifySource } from '@/lib/source'
import { addSource, addView } from '@/lib/views'

/**
 * Soma uma visualização na página. `firstVisit` diz se é a primeira vez
 * deste navegador nesta página (para contar visitantes diferentes).
 * `origin` só vem na primeira página da visita: a etiqueta do link (utm_source) e o
 * endereço de onde a pessoa veio. Sem ele, só as visualizações são somadas.
 */
export async function countView(
  path: string,
  firstVisit: boolean,
  origin?: { utm?: string; referrer?: string },
): Promise<void> {
  // Só a página inicial, o portfólio e páginas de projeto, para ninguém criar linhas com endereço inventado.
  const match = /^\/(?:portfolio|projetos\/([a-z0-9-]{1,100}))?$/.exec(String(path))
  if (!match) return
  // Você logado no /admin não conta (o Payload guarda o login neste cookie).
  if ((await cookies()).has('payload-token')) return

  const payload = await getPayload({ config })
  if (match[1]) {
    const { totalDocs } = await payload.count({
      collection: 'projects',
      where: { slug: { equals: match[1] } },
      overrideAccess: false,
    })
    if (!totalDocs) return
  }

  await addView(payload, path, firstVisit)
  if (origin) await addSource(payload, classifySource(origin.utm, origin.referrer))
}
