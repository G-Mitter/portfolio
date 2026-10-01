import Image from 'next/image'

import type { Project } from '@/payload-types'

type Props = {
  project: Pick<Project, 'title' | 'category' | 'cover' | 'coverCode' | 'result'>
  large?: boolean
}

/**
 * A capa quadrada de um post.
 *
 * Se o projeto tem imagem de capa, mostramos a imagem.
 * Se não tem, geramos uma capa com a cor da categoria, o título e um
 * trecho de código, igual ao protótipo aprovado na Sprint 2.
 */
export function PostCover({ project, large = false }: Props) {
  // `cover` pode chegar como número (só o id) ou como objeto Media completo,
  // dependendo do `depth` da consulta. Só usamos se for o objeto com url.
  const cover = typeof project.cover === 'object' ? project.cover : null

  if (cover?.url) {
    return (
      <Image
        className="cover-img"
        src={cover.url}
        alt={cover.alt}
        fill
        // Na página do projeto (large) a capa é a maior imagem visível: carregar já.
        loading={large ? 'eager' : 'lazy'}
        sizes={large ? '(max-width: 640px) 100vw, 520px' : '(max-width: 640px) 50vw, 310px'}
      />
    )
  }

  return (
    <div className={`cover c-${project.category}`}>
      <div className="glyph">{project.coverCode}</div>
      <div>
        <h3>{project.title}</h3>
        {!large && project.result && <div className="res">{project.result}</div>}
      </div>
    </div>
  )
}
