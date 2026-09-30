import { getPayload } from 'payload'

import config from '@/payload.config'
import { Feed } from '@/components/Feed'
import { ProfileHeader } from '@/components/ProfileHeader'

/**
 * 'force-dynamic' faz a página buscar os dados a cada visita.
 * Assim, um post publicado no /admin aparece na hora.
 * Na Sprint 7 (performance) trocamos por cache com revalidação.
 */
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  // getPayload dá acesso direto ao banco pelo "Local API" do Payload.
  // Como esta página roda no servidor, não precisa de fetch nem de URL de API.
  const payload = await getPayload({ config })

  // Promise.all dispara as duas consultas ao mesmo tempo em vez de uma depois da outra.
  const [profile, projects] = await Promise.all([
    payload.findGlobal({ slug: 'profile', depth: 1 }),
    payload.find({
      collection: 'projects',
      depth: 1, // traz a imagem de capa completa (url, alt), não só o id
      limit: 100,
      sort: ['-pinned', '-date'],
      // overrideAccess: false aplica as regras de acesso de um visitante:
      // rascunhos não aparecem no feed público.
      overrideAccess: false,
    }),
  ])

  return (
    <>
      <ProfileHeader profile={profile} projectCount={projects.totalDocs} />
      <Feed projects={projects.docs} />
    </>
  )
}
