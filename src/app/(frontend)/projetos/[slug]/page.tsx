import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import { cache } from 'react'

import config from '@/payload.config'
import type { Media } from '@/payload-types'
import { Gallery } from '@/components/Gallery'
import { LikeButton } from '@/components/LikeButton'
import { PostCover } from '@/components/PostCover'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { STATUS_LABELS } from '@/lib/labels'
import { isVisitorId, VISITOR_COOKIE } from '@/lib/likes'
import { siteUrl } from '@/lib/siteUrl'

export const dynamic = 'force-dynamic'

type Props = {
  // [slug] no nome da pasta vira este parâmetro. Ex.: /projetos/wincorretor -> slug = 'wincorretor'
  params: Promise<{ slug: string }>
}

/**
 * Busca um projeto pelo slug.
 * `cache` do React garante que generateMetadata e a página, que pedem o
 * mesmo projeto, façam uma consulta só ao banco.
 */
const getProject = cache(async (slug: string) => {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'projects',
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
    overrideAccess: false,
  })
  return result.docs[0] ?? null
})

/**
 * Quantas curtidas o projeto tem e se este navegador já curtiu.
 * O cookie só é lido aqui; quem cria o cookie é a Server Action, no primeiro clique.
 */
async function getLikes(projectId: number) {
  const payload = await getPayload({ config })
  const visitor = (await cookies()).get(VISITOR_COOKIE)?.value
  const [count, mine] = await Promise.all([
    payload.count({ collection: 'likes', where: { project: { equals: projectId } } }),
    isVisitorId(visitor)
      ? payload.count({
          collection: 'likes',
          where: { and: [{ project: { equals: projectId } }, { visitor: { equals: visitor } }] },
        })
      : null,
  ])
  return { count: count.totalDocs, liked: Boolean(mine?.totalDocs) }
}

// Título e prévia do link quando alguém compartilha no LinkedIn/WhatsApp (Open Graph).
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) return {}

  const cover = typeof project.cover === 'object' ? project.cover : null
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projetos/${slug}` },
    // O openGraph da página substitui o do layout, por isso repete o básico e cai na imagem padrão sem capa.
    openGraph: {
      type: 'article',
      locale: 'pt_BR',
      siteName: 'Guilherme Mitter',
      title: project.title,
      description: project.summary,
      images: [cover?.url ?? '/og.png'],
    },
  }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project = await getProject(slug)

  // Slug que não existe (ou rascunho) -> página 404.
  if (!project) notFound()
  const likes = await getLikes(project.id)

  // Junta a capa e a galeria numa lista só de imagens para o carrossel.
  // O filtro descarta itens que vieram só como id (número) ou sem url.
  const images = [project.cover, ...(project.gallery ?? [])].filter(
    (item): item is Media => typeof item === 'object' && item !== null && Boolean(item.url),
  )

  // Links internos: outros projetos no fim da página mantêm o visitante (e o Google) navegando pelo site.
  const payload = await getPayload({ config })
  const others = await payload.find({
    collection: 'projects',
    where: { slug: { not_equals: slug } },
    sort: ['-pinned', '_order'],
    limit: 3,
    depth: 0,
    overrideAccess: false,
    select: { title: true, slug: true },
  })

  // Dados estruturados do projeto (schema.org), lidos pelo Google.
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.summary,
    url: `${siteUrl}/projetos/${slug}`,
    image: images[0]?.url ? new URL(images[0].url, siteUrl).toString() : undefined,
    keywords: project.stack.join(', '),
    author: { '@type': 'Person', name: 'Guilherme Mitter', url: siteUrl },
  }

  return (
    <>
      {/* O "<" é trocado para que nenhum texto do /admin consiga fechar a tag <script>. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
      />
      <Link className="back" href="/portfolio">
        ← voltar ao portfólio
      </Link>
      <article className="detail">
        <div className="carousel">
          {images.length > 0 ? <Gallery images={images} /> : <PostCover project={project} large />}
        </div>
        <div className="side">
          <div className="body">
            <LikeButton
              slug={project.slug ?? ''}
              initialLiked={likes.liked}
              initialCount={likes.count}
            />
            <h1>{project.title}</h1>
            <Badge variant="status">
              <i className={`dot-${project.progress}`} />
              {STATUS_LABELS[project.progress]}
            </Badge>
            <p>{project.summary}</p>
            {project.result && (
              <div>
                <div className="label">Resultado</div>
                <div className="result">{project.result}</div>
              </div>
            )}
            {project.description && (
              <div>
                <div className="label">Sobre o projeto</div>
                <div className="richtext">
                  <RichText data={project.description} />
                </div>
              </div>
            )}
            <div>
              <div className="label">Tecnologias</div>
              <div className="chips">
                {project.stack.map((tech) => (
                  <Badge key={tech}>{tech}</Badge>
                ))}
              </div>
            </div>
            {/* Chamada para quem gostou do projeto: leva ao formulário já sabendo de onde veio. */}
            <div className="similar">
              <b>Quer algo parecido na sua empresa?</b>
              <Button asChild variant="default">
                <Link href={`/?projeto=${project.slug}#contato`}>Vamos conversar</Link>
              </Button>
            </div>
          </div>
          <div className="links">
            {project.links?.repository ? (
              <Button asChild>
                <a href={project.links.repository} target="_blank" rel="noopener noreferrer">
                  Ver código
                </a>
              </Button>
            ) : (
              <Badge>Projeto interno</Badge>
            )}
            {project.links?.demo && (
              <Button asChild variant="default">
                <a href={project.links.demo} target="_blank" rel="noopener noreferrer">
                  Ver demo
                </a>
              </Button>
            )}
          </div>
        </div>
      </article>
      {others.docs.length > 0 && (
        <nav className="more" aria-labelledby="mais-titulo">
          <h2 id="mais-titulo">Outros projetos</h2>
          <ul>
            {others.docs.map((other) => (
              <li key={other.slug}>
                <Link href={`/projetos/${other.slug}`}>{other.title}</Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  )
}
