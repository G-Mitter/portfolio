import { TechBadge } from '@/components/TechBadge'
import { CATEGORY_LABELS } from '@/lib/labels'
import type { Project } from '@/payload-types'

/**
 * "Post" de exemplo que flutua ao lado da foto, no topo da home (só em telas largas).
 * O 1º mostra também as tecnologias; o 2º e o 3º são compactos e só aparecem em telas bem largas (ver .hero-card-2/3).
 * É decorativo: o projeto já aparece (com link) nos destaques mais abaixo, então fica fora
 * da leitura de tela (aria-hidden) e sem links.
 */
export function HeroCard({ project, n }: { project: Project; n: 1 | 2 | 3 }) {
  return (
    <div className={`hero-card hero-card-${n}`} aria-hidden="true">
      <p className="hero-card-cat">{CATEGORY_LABELS[project.category]}</p>
      <p className="hero-card-title">{project.title}</p>
      {project.result && <p className="hero-card-result">{project.result}</p>}
      {n === 1 && project.stack.length > 0 && (
        <div className="chips">
          {project.stack.slice(0, 3).map((tech) => (
            <TechBadge key={tech} name={tech} />
          ))}
        </div>
      )}
    </div>
  )
}
