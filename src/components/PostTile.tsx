import Link from 'next/link'

import type { Project } from '@/payload-types'
import { STATUS_LABELS } from '@/lib/labels'
import { PostCover } from './PostCover'

/** Um quadrado do feed: capa, selo de andamento e, no hover, resultado e tecnologias. */
export function PostTile({ project }: { project: Project }) {
  return (
    <Link
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
      {/* No hover, o resultado vem primeiro (o que o cliente quer saber)
          e as tecnologias depois (o que o recrutador quer saber). */}
      <span className="hover">
        {project.result && <b className="hover-result">{project.result}</b>}
        <span className="hover-stack">
          {project.stack.map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </span>
      </span>
    </Link>
  )
}
