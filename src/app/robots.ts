import type { MetadataRoute } from 'next'

import { siteUrl } from '@/lib/siteUrl'

// /robots.txt (o Next só aceita este arquivo na raiz de app/): avisa aos buscadores que podem visitar tudo, menos o painel, e onde está o sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', disallow: '/admin' },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
