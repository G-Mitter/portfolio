'use client'

/**
 * Carrossel de imagens da página do projeto.
 *
 * Ideia principal: quem faz o "deslizar" é o próprio CSS (scroll-snap).
 * As imagens ficam lado a lado numa faixa com rolagem horizontal, e o
 * navegador encaixa cada uma no lugar. Isso já funciona com o dedo no
 * celular e com o trackpad, sem biblioteca.
 *
 * O JavaScript só faz duas coisas:
 * 1. As setas rolam a faixa uma "tela" para o lado.
 * 2. Quando a faixa rola, descobrimos qual slide está visível para acender a bolinha certa.
 */
import Image from 'next/image'
import { useRef, useState } from 'react'

import type { Media } from '@/payload-types'

type Props = {
  images: Media[]
}

export function Gallery({ images }: Props) {
  // useRef guarda uma referência ao elemento da faixa no HTML, para podermos rolá-lo.
  const trackRef = useRef<HTMLDivElement>(null)
  // useState guarda qual slide está visível. Quando muda, o React redesenha as bolinhas.
  const [current, setCurrent] = useState(0)

  function goTo(index: number) {
    const track = trackRef.current
    if (!track) return
    // Cada slide tem a largura da faixa, então o slide N começa em N × largura.
    track.scrollTo({ left: index * track.clientWidth, behavior: 'smooth' })
  }

  function handleScroll() {
    const track = trackRef.current
    if (!track) return
    // Arredondamos a posição da rolagem dividida pela largura para saber o slide atual.
    setCurrent(Math.round(track.scrollLeft / track.clientWidth))
  }

  const hasMany = images.length > 1

  return (
    <div className="gallery">
      <div
        className="gallery-track"
        ref={trackRef}
        onScroll={handleScroll}
        // tabIndex permite focar a faixa com Tab e rolar com as setas do teclado
        tabIndex={0}
        aria-label="Galeria de imagens do projeto"
      >
        {images.map((image, index) => (
          <div className="gallery-slide" key={image.id}>
            {image.url && (
              <Image
                src={image.url}
                alt={image.alt}
                fill
                sizes="(max-width: 640px) 100vw, 520px"
                // A primeira imagem carrega na hora (é a maior coisa visível da página);
                // as outras só quando o usuário chegar nelas.
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            )}
          </div>
        ))}
      </div>

      {hasMany && (
        <>
          <button
            className="nav l"
            type="button"
            aria-label="Imagem anterior"
            onClick={() => goTo(current - 1)}
            disabled={current === 0}
          >
            ‹
          </button>
          <button
            className="nav r"
            type="button"
            aria-label="Próxima imagem"
            onClick={() => goTo(current + 1)}
            disabled={current === images.length - 1}
          >
            ›
          </button>
          <div className="dots">
            {images.map((image, index) => (
              <button
                key={image.id}
                type="button"
                className={index === current ? 'on' : undefined}
                aria-label={`Ir para a imagem ${index + 1}`}
                aria-current={index === current}
                onClick={() => goTo(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
