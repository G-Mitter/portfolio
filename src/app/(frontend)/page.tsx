import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { ContactSection } from '@/components/ContactSection'
import { DemoVideo } from '@/components/DemoVideo'
import { Intro } from '@/components/Intro'
import { ProjectCard } from '@/components/ProjectCard'
import { Process } from '@/components/Process'
import { Statement } from '@/components/Statement'
import { Services } from '@/components/Services'
import { Testimonials } from '@/components/Testimonials'
import { Timeline } from '@/components/Timeline'
import { WhatsAppFloat } from '@/components/WhatsAppFloat'
import { Button } from '@/components/ui/button'
import { instagramUrl } from '@/lib/instagram'
import { siteUrl } from '@/lib/siteUrl'
import { contactMessage, whatsappUrl } from '@/lib/whatsapp'

// Busca os dados a cada visita: o que você muda no /admin aparece na hora.
export const dynamic = 'force-dynamic'

// Endereço oficial da página: evita o Google tratar /?projeto=... como outra página.
export const metadata: Metadata = { alternates: { canonical: '/' } }

// Vídeos da seção "Veja os robôs trabalhando" (arquivos em public/videos/). Para somar um, é só incluir uma linha aqui.
const DEMOS = [
  {
    name: 'Conciliador',
    text: 'Cruza vendas, recebimentos e extrato e mostra onde o dinheiro não bateu.',
    wide: '/videos/conciliador-demo-16x9.mp4',
    tall: '/videos/conciliador-demo-vertical.mp4',
    label:
      'Demonstração do Conciliador: o robô lê as planilhas, concilia 1.248 dados em 3 segundos e mostra que o recebido ficou R$ 12.350 abaixo do vendido. Dados fictícios.',
  },
  {
    name: 'Robô de Carga dos Caixas',
    text: 'Envia os produtos novos e alterados para os caixas de todas as lojas, sem ninguém na frente.',
    wide: '/videos/robo-carga-16x9.mp4',
    tall: '/videos/robo-carga-vertical.mp4',
    label:
      'Demonstração do Robô de Carga dos Caixas: o robô seleciona as alterações, visualiza os produtos, executa a carga e repete para as 23 lojas até aparecer "Carga concluída". Dados fictícios.',
  },
  {
    name: 'SupplyFlow',
    text: 'Pedido de suprimentos da filial vira linha na planilha, baixa de estoque, aviso no Chat e custo por filial, sem ninguém digitar.',
    wide: '/videos/supplyflow-16x9.mp4',
    tall: '/videos/supplyflow-vertical.mp4',
    label:
      'Demonstração do SupplyFlow: a filial envia o pedido pelo formulário, a planilha registra a demanda e dá baixa no estoque, o Chat e o e-mail avisam a entrega, e a pesquisa mostra o custo da filial no período. Dados fictícios.',
  },
]

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

  const whatsapp = whatsappUrl(profile.links?.whatsapp, contactMessage(profile.name))
  const avatar = typeof profile.avatar === 'object' ? profile.avatar : null

  // Dados estruturados (schema.org): a "ficha" que o Google lê para saber quem você é e onde atende.
  const person = {
    '@type': 'Person',
    '@id': `${siteUrl}/#pessoa`,
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
  // O site em si e o serviço oferecido, ligados à pessoa pelo @id.
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      person,
      { '@type': 'WebSite', '@id': `${siteUrl}/#site`, url: siteUrl, name: 'Guilherme Mitter', inLanguage: 'pt-BR', publisher: { '@id': person['@id'] } },
      {
        '@type': 'ProfessionalService',
        '@id': `${siteUrl}/#servico`,
        name: 'Guilherme Mitter Automações',
        url: siteUrl,
        image: `${siteUrl}/og.png`,
        description: 'Automação de processos, RPA, Python e sites para empresas em Santa Luzia e Belo Horizonte.',
        founder: { '@id': person['@id'] },
        areaServed: person.areaServed,
      },
    ],
  }

  return (
    <>
      {/* O "<" é trocado para que nenhum texto do /admin consiga fechar a tag <script>. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
      />
      <Intro profile={profile} projectCount={projects.totalDocs} featured={projects.docs} />
      <Statement />
      <section className="demo band band-dark" aria-labelledby="demo-titulo">
        <h2 id="demo-titulo">Veja os robôs trabalhando</h2>
        <div className="demo-list">
          {DEMOS.map((demo) => (
            <figure key={demo.name}>
              <DemoVideo wide={demo.wide} tall={demo.tall} label={demo.label} />
              <figcaption>
                <b>{demo.name}</b>
                <span>{demo.text}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <small>Demonstrações com dados fictícios.</small>
      </section>
      {projects.docs.length > 0 && (
        <section className="featured band band-dark" aria-labelledby="destaques-titulo">
          <h2 id="destaques-titulo">Projetos em destaque</h2>
          <div className="grid">
            {/* O resultado vai numa etiqueta dentro do cartão: no celular não existe hover. */}
            {projects.docs.map((project) => (
              <div key={project.id}>
                <ProjectCard project={project} showResult />
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
      <Timeline />
      <Testimonials testimonials={profile.testimonials} />
      <ContactSection
        whatsapp={whatsapp}
        email={profile.links?.email}
        source={typeof projeto === 'string' ? projeto : undefined}
      />
      {whatsapp && <WhatsAppFloat href={whatsapp} />}
    </>
  )
}
