import Link from 'next/link'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { ContactSection } from '@/components/ContactSection'
import { Intro } from '@/components/Intro'
import { PostTile } from '@/components/PostTile'
import { Process } from '@/components/Process'
import { Services } from '@/components/Services'
import { Testimonials } from '@/components/Testimonials'
import { contactMessage, whatsappUrl } from '@/lib/whatsapp'

// Busca os dados a cada visita: o que você muda no /admin aparece na hora.
export const dynamic = 'force-dynamic'

type Props = {
  // ?projeto=slug vem do botão "Quer algo parecido?" da página de um projeto.
  searchParams: Promise<{ projeto?: string | string[] }>
}

/**
 * Página inicial (guimitter.com.br): apresentação para clientes.
 * Mostra quem você é, três projetos em destaque e o que você oferece,
 * e termina no formulário de contato. O feed completo fica em /portfolio.
 */
export default async function HomePage({ searchParams }: Props) {
  const { projeto } = await searchParams
  const payload = await getPayload({ config })

  const [profile, projects] = await Promise.all([
    payload.findGlobal({ slug: 'profile', depth: 1 }),
    payload.find({
      collection: 'projects',
      depth: 1,
      limit: 3, // os três primeiros do feed: fixados e depois a ordem do /admin
      sort: ['-pinned', '_order'],
      overrideAccess: false,
    }),
  ])

  return (
    <>
      <Intro profile={profile} projectCount={projects.totalDocs} />
      {projects.docs.length > 0 && (
        <section className="featured" aria-labelledby="destaques-titulo">
          <h2 id="destaques-titulo">Projetos em destaque</h2>
          <div className="grid">
            {/* O resultado fica escrito embaixo da capa: no celular não existe hover. */}
            {projects.docs.map((project) => (
              <div key={project.id}>
                <PostTile project={project} />
                {project.result && <p className="featured-result">{project.result}</p>}
              </div>
            ))}
          </div>
          <Link className="btn" href="/portfolio">
            Ver todos os {projects.totalDocs} projetos →
          </Link>
        </section>
      )}
      <Services services={profile.services} />
      <Process steps={profile.process} />
      <Testimonials testimonials={profile.testimonials} />
      <ContactSection
        whatsapp={whatsappUrl(profile.links?.whatsapp, contactMessage(profile.name))}
        email={profile.links?.email}
        source={typeof projeto === 'string' ? projeto : undefined}
      />
    </>
  )
}
