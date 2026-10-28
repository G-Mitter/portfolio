import { CATEGORY_LABELS } from '@/lib/labels'
import type { Project } from '@/payload-types'

/**
 * "Post" de exemplo que flutua ao lado da foto, no topo da home (só em telas largas).
 * Os 3 têm o mesmo tamanho; o 2º e o 3º só aparecem em telas bem largas (ver .hero-card-2/3).
 * É decorativo: o projeto já aparece (com link) nos destaques mais abaixo, então fica fora
 * da leitura de tela (aria-hidden) e sem links.
 */
export function HeroCard({ project, n }: { project: Project; n: 1 | 2 | 3 }) {
  return (
    <div className={`hero-card hero-card-${n}`} aria-hidden="true">
      <p className="hero-card-cat">{CATEGORY_LABELS[project.category]}</p>
      <p className="hero-card-title">{project.title}</p>
      {project.result && <p className="hero-card-result">{project.result}</p>}
    </div>
  )
}
