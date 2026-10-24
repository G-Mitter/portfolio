import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { ContactSection } from '@/components/ContactSection'
import { Intro } from '@/components/Intro'
import { PostTile } from '@/components/PostTile'
import { Process } from '@/components/Process'
import { Statement } from '@/components/Statement'
import { Services } from '@/components/Services'
import { Testimonials } from '@/components/Testimonials'
import { Button } from '@/components/ui/button'
import { instagramUrl } from '@/lib/instagram'
import { siteUrl } from '@/lib/siteUrl'
import { contactMessage, whatsappUrl } from '@/lib/whatsapp'

// Busca os dados a cada visita: o que você muda no /admin aparece na hora.
export const dynamic = 'force-dynamic'

// Endereço oficial da página: evita o Google tratar /?projeto=... como outra página.
export const metadata: Metadata = { alternates: { canonical: '/' } }

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

  const avatar = typeof profile.avatar === 'object' ? profile.avatar : null

  // Dados estruturados (schema.org): a "ficha" que o Google lê para saber quem você é e onde atende.
  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    alternateName: ['guimitter', profile.handle].filter(Boolean),
    jobTitle: profile.role,
    url: siteUrl,
    image: avatar?.url ? new URL(avatar.url, siteUrl).toString() : undefined,
    address: { '@type': 'PostalAddress', addressLocality: 'Belo Horizonte', addressRegion: 'MG', addressCountry: 'BR' },
    areaServed: ['Santa Luzia', 'Belo Horizonte'].map((name) => ({ '@type': 'City', name })),
    knowsAbout: ['Automação de processos', 'RPA', 'Python', 'Desenvolvimento web', 'Inteligência artificial'],
    sameAs: [profile.links?.github, profile.links?.linkedin, instagramUrl(profile.links?.instagram)].filter(Boolean),
  }

  return (
    <>
      {/* O "<" é trocado para que nenhum texto do /admin consiga fechar a tag <script>. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(person).replace(/</g, '\\u003c') }}
      />
      <Intro profile={profile} projectCount={projects.totalDocs} />
      <Statement />
      {projects.docs.length > 0 && (
        <section className="featured band band-dark" aria-labelledby="destaques-titulo">
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
          <Button asChild>
            <Link href="/portfolio">Ver todos os {projects.totalDocs} projetos →</Link>
          </Button>
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
