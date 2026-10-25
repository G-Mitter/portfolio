'use client'

/**
 * 'use client' marca este componente como "Client Component":
 * ele roda no navegador e pode ter estado (useState) e cliques.
 * A página que busca os dados no banco continua rodando no servidor
 * e só entrega a lista de projetos pronta para cá.
 */
import { useState } from 'react'

import type { Project } from '@/payload-types'
import { CATEGORY_LABELS } from '@/lib/labels'
import { ProjectCard } from './ProjectCard'

type Filter = 'all' | Project['category']

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'Tudo' },
  ...(Object.keys(CATEGORY_LABELS) as Project['category'][]).map((category) => ({
    value: category,
    label: CATEGORY_LABELS[category],
  })),
]

export function Feed({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>('all')
  // As capas só ganham o fade depois do primeiro clique em um filtro (não na abertura da página).
  const [swapped, setSwapped] = useState(false)

  // Filtrar aqui no navegador é instantâneo e evita ir ao servidor a cada clique.
  // Com poucas dezenas de posts isso é o mais simples; com milhares,
  // o filtro iria para a consulta do banco.
  const visible = projects.filter(
    (project) => filter === 'all' || project.category === filter,
  )

  return (
    <>
      <nav className="highlights" aria-label="Filtrar projetos">
        {FILTERS.map((item) => (
          <button
            key={item.value}
            className="hl"
            type="button"
            aria-pressed={filter === item.value}
            onClick={() => {
              setFilter(item.value)
              setSwapped(true)
            }}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className={swapped ? 'grid swap' : 'grid'} key={filter}>
        {visible.length === 0 && <p className="empty">Nenhum projeto nesta categoria ainda.</p>}
        {visible.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </>
  )
}
