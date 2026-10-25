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
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { PostTile } from './PostTile'

type Filter = 'all' | 'in-progress' | Project['category']

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'Tudo' },
  ...(Object.keys(CATEGORY_LABELS) as Project['category'][]).map((category) => ({
    value: category,
    label: CATEGORY_LABELS[category],
  })),
  { value: 'in-progress', label: 'Em andamento' },
]

export function Feed({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>('all')
  // As capas só ganham o fade depois do primeiro clique em um filtro (não na abertura da página).
  const [swapped, setSwapped] = useState(false)

  // Filtrar aqui no navegador é instantâneo e evita ir ao servidor a cada clique.
  // Com poucas dezenas de posts isso é o mais simples; com milhares,
  // o filtro iria para a consulta do banco.
  const visible = projects.filter(
    (project) => filter === 'all' || project.category === filter || project.progress === filter,
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
          // Um cartão só: capa, nome, resumo, até 4 tecnologias e a ação, com o mesmo espaçamento em todos.
          <article key={project.id} className="card">
            {/* A capa é só um atalho para quem usa mouse ou toque; teclado e leitor de tela usam o título. */}
            <PostTile project={project} decorative />
            <div className="card-body">
              <p className="card-cat">{CATEGORY_LABELS[project.category]}</p>
              <h3>
                <Link href={`/projetos/${project.slug}`}>{project.title}</Link>
              </h3>
              <p className="card-sum">{project.summary}</p>
              {project.stack.length > 0 && (
                <div className="chips">
                  {project.stack.slice(0, 4).map((tech) => (
                    <Badge key={tech}>{tech}</Badge>
                  ))}
                </div>
              )}
              <Link className="card-go" href={`/projetos/${project.slug}`} aria-label={`Ver projeto ${project.title}`}>
                Ver projeto →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </>
  )
}
