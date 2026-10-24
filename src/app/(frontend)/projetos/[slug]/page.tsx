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
    openGraph: {
      title: project.title,
      description: project.summary,
      images: cover?.url ? [cover.url] : undefined,
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

  return (
    <>
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
    </>
  )
}
