'use client'

/**
 * 'use client' marca este componente como "Client Component":
 * ele roda no navegador e pode ter estado (useState) e cliques.
 * A página que busca os dados no banco continua rodando no servidor
 * e só entrega a lista de projetos pronta para cá.
 */
import Link from 'next/link'
import { useState } from 'react'

import type { Project } from '@/payload-types'
import { CATEGORY_ICONS, CATEGORY_LABELS, STATUS_LABELS } from '@/lib/labels'
import { PostCover } from './PostCover'

type Filter = 'all' | 'in-progress' | Project['category']

const FILTERS: { value: Filter; label: string; icon: string }[] = [
  { value: 'all', label: 'Tudo', icon: '∗' },
  ...(Object.keys(CATEGORY_LABELS) as Project['category'][]).map((category) => ({
    value: category,
    label: CATEGORY_LABELS[category],
    icon: CATEGORY_ICONS[category],
  })),
  { value: 'in-progress', label: 'Em andamento', icon: '…' },
]

export function Feed({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>('all')

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
            onClick={() => setFilter(item.value)}
          >
            <span className="ring">{item.icon}</span>
            <small>{item.label}</small>
          </button>
        ))}
      </nav>

      <div className="tabs">
        <span className="on">▦ Projetos</span>
      </div>

      <div className="grid">
        {visible.length === 0 && <p className="empty">Nenhum projeto nesta categoria ainda.</p>}
        {visible.map((project) => (
          <Link
            key={project.id}
            href={`/projetos/${project.slug}`}
            className="post"
            aria-label={`${project.title}, ${STATUS_LABELS[project.progress]}`}
          >
            <PostCover project={project} />
            {project.pinned && <span className="pin">📌 fixado</span>}
            <span className="badge">
              <i className={`dot-${project.progress}`} />
              {STATUS_LABELS[project.progress]}
            </span>
            <span className="hover">
              {project.stack.map((tech) => (
                <span key={tech}>{tech}</span>
              ))}
            </span>
          </Link>
        ))}
      </div>
    </>
  )
}
