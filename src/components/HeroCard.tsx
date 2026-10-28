import { TechBadge } from '@/components/TechBadge'
import { CATEGORY_LABELS } from '@/lib/labels'
import type { Project } from '@/payload-types'

/**
 * "Post" de exemplo que flutua ao lado da foto, no topo da home (só em telas largas).
 * É decorativo: o projeto já aparece (com link) nos destaques mais abaixo, então fica fora
 * da leitura de tela (aria-hidden) e sem links.
 */
export function HeroCard({ project }: { project: Project }) {
  return (
    <div className="hero-card" aria-hidden="true">
      <p className="hero-card-cat">{CATEGORY_LABELS[project.category]}</p>
      <p className="hero-card-title">{project.title}</p>
      {project.result && <p className="hero-card-result">{project.result}</p>}
      {project.stack.length > 0 && (
        <div className="chips">
          {project.stack.slice(0, 3).map((tech) => (
            <TechBadge key={tech} name={tech} />
          ))}
        </div>
      )}
    </div>
  )
}
