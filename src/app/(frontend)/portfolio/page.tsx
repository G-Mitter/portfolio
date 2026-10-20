import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { Feed } from '@/components/Feed'
import { ProfileHeader } from '@/components/ProfileHeader'
import { Skills } from '@/components/Skills'

// Busca os dados a cada visita: um post publicado no /admin aparece na hora.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Portfólio', alternates: { canonical: '/portfolio' } }

/** /portfolio: o perfil no estilo rede social e o feed com todos os projetos. */
export default async function PortfolioPage() {
  const payload = await getPayload({ config })

  // Promise.all dispara as duas consultas ao mesmo tempo em vez de uma depois da outra.
  const [profile, projects] = await Promise.all([
    payload.findGlobal({ slug: 'profile', depth: 1 }),
    payload.find({
      collection: 'projects',
      depth: 1, // traz a imagem de capa completa (url, alt), não só o id
      limit: 100,
      // Fixados primeiro; o resto segue a ordem que você arrasta no /admin.
      sort: ['-pinned', '_order'],
      // overrideAccess: false aplica as regras de acesso de um visitante:
      // rascunhos não aparecem no feed público.
      overrideAccess: false,
    }),
  ])

  return (
    <>
      <ProfileHeader profile={profile} projectCount={projects.totalDocs} />
      <Feed projects={projects.docs} />
      <Skills skills={profile.skills} />
      {/* Atalho discreto para o dashboard (que pede login do /admin). */}
      <p style={{ textAlign: 'right', margin: 0 }}>
        <Link href="/dashboard" className="foot-dash" aria-label="Dashboard" title="Dashboard">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <rect x="1" y="9" width="3" height="6" rx="1" /><rect x="6.5" y="4" width="3" height="11" rx="1" /><rect x="12" y="1" width="3" height="14" rx="1" />
          </svg>
        </Link>
      </p>
    </>
  )
}
