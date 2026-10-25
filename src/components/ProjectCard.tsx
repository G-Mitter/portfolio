import Link from 'next/link'

import type { Project } from '@/payload-types'
import { CATEGORY_LABELS } from '@/lib/labels'
import { TechBadge } from '@/components/TechBadge'
import { PostTile } from './PostTile'

/**
 * Cartão de projeto, igual no feed do /portfolio e nos destaques da home:
 * capa, categoria, nome, resumo, até 4 tecnologias e a ação, tudo dentro do mesmo contorno.
 * `showResult`: mostra o resultado numa etiqueta (usado nos destaques, onde o número convence).
 */
export function ProjectCard({ project, showResult = false }: { project: Project; showResult?: boolean }) {
  // Capa enviada no /admin já traz título e resumo escritos na arte: nos destaques da home o texto
  // repetido sai da vista, mas segue no HTML (leitor de tela e Google).
  const textInCover = showResult && typeof project.cover === 'object' && Boolean(project.cover?.url)
  const hidden = textInCover ? 'card-vh' : undefined
  return (
    <article className="card">
      {/* A capa é só um atalho para quem usa mouse ou toque; teclado e leitor de tela usam o título. */}
      <PostTile project={project} decorative />
      <div className="card-body">
        <p className="card-cat">{CATEGORY_LABELS[project.category]}</p>
        <h3 className={hidden}>
          <Link href={`/projetos/${project.slug}`}>{project.title}</Link>
        </h3>
        <p className={hidden ? `card-sum ${hidden}` : 'card-sum'}>{project.summary}</p>
        {showResult && project.result && (
          <p className="card-result">
            <span>{project.result}</span>
          </p>
        )}
        {project.stack.length > 0 && (
          <div className="chips">
            {project.stack.slice(0, 4).map((tech) => (
              <TechBadge key={tech} name={tech} />
            ))}
          </div>
        )}
        <Link className="card-go" href={`/projetos/${project.slug}`} aria-label={`Ver projeto ${project.title}`}>
          Ver projeto →
        </Link>
      </div>
    </article>
  )
}
