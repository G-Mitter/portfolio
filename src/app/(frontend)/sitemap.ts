import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { siteUrl } from '@/lib/siteUrl'

// Gerado na hora do pedido: um projeto novo entra no mapa sem precisar republicar.
export const dynamic = 'force-dynamic'

/**
 * /sitemap.xml: a lista de páginas que o Google deve visitar.
 * overrideAccess: false aplica as mesmas regras do visitante, então só entram projetos publicados.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'projects',
    overrideAccess: false,
    pagination: false,
    depth: 0,
    select: { slug: true, updatedAt: true },
  })
  return [
    { url: siteUrl, lastModified: new Date() },
    ...docs.map((p) => ({ url: `${siteUrl}/projetos/${p.slug}`, lastModified: p.updatedAt })),
  ]
}
