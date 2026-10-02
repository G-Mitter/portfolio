import { getPayload } from 'payload'

import config from '@/payload.config'
import { ContactSection } from '@/components/ContactSection'
import { Feed } from '@/components/Feed'
import { ProfileHeader } from '@/components/ProfileHeader'
import { Process } from '@/components/Process'
import { Services } from '@/components/Services'
import { Skills } from '@/components/Skills'
import { contactMessage, whatsappUrl } from '@/lib/whatsapp'

/**
 * 'force-dynamic' faz a página buscar os dados a cada visita.
 * Assim, um post publicado no /admin aparece na hora.
 * Na Sprint 7 (performance) trocamos por cache com revalidação.
 */
export const dynamic = 'force-dynamic'

type Props = {
  // ?projeto=slug vem do botão "Quer algo parecido?" da página de um projeto.
  searchParams: Promise<{ projeto?: string | string[] }>
}

export default async function HomePage({ searchParams }: Props) {
  const { projeto } = await searchParams

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
      <Services services={profile.services} />
      <Process steps={profile.process} />
      <ContactSection
        whatsapp={whatsappUrl(profile.links?.whatsapp, contactMessage(profile.name))}
        email={profile.links?.email}
        source={typeof projeto === 'string' ? projeto : undefined}
      />
    </>
  )
}
