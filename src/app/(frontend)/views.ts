'use server'

import { cookies, headers } from 'next/headers'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { parsePlace } from '@/lib/place'
import { classifySource } from '@/lib/source'
import { addPlace, addSource, addView } from '@/lib/views'

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
  if (origin) {
    await addSource(payload, classifySource(origin.utm, origin.referrer))
    // Lugar: a Vercel informa país, cidade e coordenadas nestes cabeçalhos (no seu computador não existem).
    const h = await headers()
    const place = parsePlace({
      country: h.get('x-vercel-ip-country'),
      city: h.get('x-vercel-ip-city'),
      lat: h.get('x-vercel-ip-latitude'),
      lon: h.get('x-vercel-ip-longitude'),
    })
    if (place) await addPlace(payload, place)
  }
}
