'use client'

/**
 * Coração do post + convite depois da curtida.
 *
 * O número muda na hora do clique (antes da resposta do servidor), para o
 * botão parecer instantâneo. Quando o servidor responde, usamos o valor real.
 *
 * O convite é um <dialog>: a janela modal nativa do navegador. Ela já fecha
 * com Esc, prende o foco do teclado dentro dela e escurece o fundo.
 * Aparece só uma vez por visita (sessionStorage), para não incomodar quem
 * curtir vários posts.
 */
import Link from 'next/link'
import { useRef, useState, useTransition } from 'react'

import { toggleLike } from '@/app/(frontend)/likes'
import { likesLabel } from '@/lib/likes'

type Props = {
  slug: string
  initialLiked: boolean
  initialCount: number
}

const INVITE_KEY = 'convite-curtida-visto'

export function LikeButton({ slug, initialLiked, initialCount }: Props) {
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)
  const [pending, startTransition] = useTransition()
  const dialogRef = useRef<HTMLDialogElement>(null)

  function openInvite() {
    try {
      if (sessionStorage.getItem(INVITE_KEY)) return
      sessionStorage.setItem(INVITE_KEY, '1')
    } catch {
      // Navegação privada pode bloquear o sessionStorage: mostramos o convite mesmo assim.
    }
    dialogRef.current?.showModal()
  }

  function handleClick() {
    const nextLiked = !liked
    setLiked(nextLiked)
    setCount((value) => value + (nextLiked ? 1 : -1))
    if (nextLiked) openInvite()

    startTransition(async () => {
      const result = await toggleLike(slug)
      if (result) {
        setLiked(result.liked)
        setCount(result.count)
      }
    })
  }

  return (
    <div className="like">
      <button
        type="button"
        className="like-btn"
        aria-pressed={liked}
        aria-label={liked ? 'Descurtir' : 'Curtir'}
        onClick={handleClick}
        disabled={pending}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.2 5.3 3.1 1.7-1.9 3.2-3.1 5.3-3.1 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z" />
        </svg>
      </button>
      <span aria-live="polite">{likesLabel(count)}</span>

      <dialog ref={dialogRef} className="invite" aria-labelledby="convite-titulo">
        <h2 id="convite-titulo">Que bom que gostou!</h2>
        <p>
          Faço sistemas assim para empresas que perdem tempo com tarefas manuais. Quer algo parecido
          no seu processo?
        </p>
        <div className="invite-actions">
          <Link className="btn primary" href={`/?projeto=${slug}#contato`}>
            Falar sobre meu projeto
          </Link>
          <Link className="btn" href="/portfolio">
            Ver mais projetos
          </Link>
        </div>
        <form method="dialog">
          <button className="invite-close" aria-label="Fechar">
            ×
          </button>
        </form>
      </dialog>
    </div>
  )
}
