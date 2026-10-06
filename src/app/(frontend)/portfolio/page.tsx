import type { Metadata } from 'next'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { Feed } from '@/components/Feed'
import { ProfileHeader } from '@/components/ProfileHeader'
import { Skills } from '@/components/Skills'

// Busca os dados a cada visita: um post publicado no /admin aparece na hora.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Portfólio' }

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
    </>
  )
}
