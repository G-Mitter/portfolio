'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'

import { DemoVideo, useMedia } from '@/components/DemoVideo'

type Slide = { name: string; text: string; wide: string; tall: string; label: string; href?: string }

const SWIPE_PX = 40 // quanto precisa arrastar na horizontal para contar como "passar"

/**
 * "Veja os robôs trabalhando": um vídeo por vez, em carrossel.
 * - Cada vídeo toca uma vez até o fim e então passa para o próximo (o ativo é o único que toca).
 * - Pausa ao passar o mouse, ao focar um controle ou no botão "Pausar": aí o vídeo fica em loop.
 * - Troca também arrastando (dedo ou mouse), pelas setas na tela e pelas setas do teclado.
 * - Quem pediu "reduzir movimento" não tem troca automática nem vídeo tocando sozinho (só os controles).
 */
export function DemoCarousel({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0)
  const [hover, setHover] = useState(false)
  const [paused, setPaused] = useState(false)
  const still = useMedia('(prefers-reduced-motion: reduce)') !== false // null (servidor) também começa parado
  const startX = useRef<number | null>(null)
  const holding = hover || paused

  const go = (step: number) => setIndex((i) => (i + step + slides.length) % slides.length)

  return (
    <div
      className="rc"
      role="group"
      aria-roledescription="carrossel"
      aria-label="Demonstrações dos robôs (dados fictícios)"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      onPointerDown={(e) => { startX.current = e.clientX }}
      onPointerUp={(e) => {
        if (startX.current === null) return
        const dx = e.clientX - startX.current
        startX.current = null
        if (Math.abs(dx) >= SWIPE_PX) go(dx < 0 ? 1 : -1)
      }}
      onPointerCancel={() => { startX.current = null }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(1)
        if (e.key === 'ArrowLeft') go(-1)
      }}
    >
      {/* Todos os cartões ocupam o mesmo lugar: a caixa tem sempre a altura do maior, sem pular. */}
      <div className="rc-slides" aria-live="off">
        {slides.map((slide, i) => (
          <figure key={slide.name} className="rc-slide" data-active={i === index} inert={i !== index}>
            <DemoVideo
              wide={slide.wide}
              tall={slide.tall}
              label={slide.label}
              active={i === index}
              loop={holding || still}
              onEnded={() => { if (i === index) go(1) }}
            />
            <figcaption>
              <b>{slide.name}</b>
              <span>{slide.text}</span>
              {slide.href && (
                <Link href={slide.href}>Ver o projeto →</Link>
              )}
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="rc-controls">
        <button type="button" className="demo-arrow" aria-label="Demonstração anterior" onClick={() => go(-1)}>‹</button>
        <div className="demo-dots">
          {slides.map((slide, i) => (
            <button
              key={slide.name}
              type="button"
              aria-label={`Ver demonstração: ${slide.name}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
        <button type="button" className="demo-arrow" aria-label="Próxima demonstração" onClick={() => go(1)}>›</button>
        {!still && (
          <button type="button" className="demo-pause" onClick={() => setPaused((p) => !p)}>
            {paused ? 'Retomar' : 'Pausar'}
          </button>
        )}
      </div>
    </div>
  )
}
