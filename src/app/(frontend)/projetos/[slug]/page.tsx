import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import { cache } from 'react'

import config from '@/payload.config'
import type { Media } from '@/payload-types'
import { Gallery } from '@/components/Gallery'
import { PostCover } from '@/components/PostCover'
import { STATUS_LABELS } from '@/lib/labels'

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

// Título e prévia do link quando alguém compartilha no LinkedIn/WhatsApp (Open Graph).
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) return {}

  const cover = typeof project.cover === 'object' ? project.cover : null
  return {
    title: project.title,
    description: project.summary,
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

  // Junta a capa e a galeria numa lista só de imagens para o carrossel.
  // O filtro descarta itens que vieram só como id (número) ou sem url.
  const images = [project.cover, ...(project.gallery ?? [])].filter(
    (item): item is Media => typeof item === 'object' && item !== null && Boolean(item.url),
  )

  return (
    <>
      <Link className="back" href="/">
        ← voltar ao feed
      </Link>
      <article className="detail">
        <div className="carousel">
          {images.length > 0 ? <Gallery images={images} /> : <PostCover project={project} large />}
        </div>
        <div className="side">
          <div className="body">
            <h2>{project.title}</h2>
            <span className="status">
              <i className={`dot-${project.progress}`} />
              {STATUS_LABELS[project.progress]}
            </span>
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
                  <span className="chip" key={tech}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            {/* Chamada para quem gostou do projeto: leva ao formulário já sabendo de onde veio. */}
            <div className="similar">
              <b>Quer algo parecido na sua empresa?</b>
              <Link className="btn primary" href={`/?projeto=${project.slug}#contato`}>
                Vamos conversar
              </Link>
            </div>
          </div>
          <div className="links">
            {project.links?.repository ? (
              <a
                className="btn"
                href={project.links.repository}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver código
              </a>
            ) : (
              <span className="chip">Projeto interno</span>
            )}
            {project.links?.demo && (
              <a
                className="btn primary"
                href={project.links.demo}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver demo
              </a>
            )}
          </div>
        </div>
      </article>
    </>
  )
}
