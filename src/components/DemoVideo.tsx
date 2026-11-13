'use client'

import { useEffect, useRef, useSyncExternalStore } from 'react'

// Lê uma media query do navegador e atualiza quando ela muda. No servidor devolve null ("ainda não sei").
export function useMedia(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(query)
      media.addEventListener('change', onChange)
      return () => media.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => null,
  )
}

/**
 * Vídeo curto em loop de uma demonstração (dados fictícios): `wide` é o arquivo 16:9, `tall` o vertical e `label` a descrição para leitores de tela.
 * - Celular recebe a versão vertical; o resto, a 16:9. O arquivo só é escolhido depois que a página
 *   abre (no navegador), então ninguém baixa os dois.
 * - Só toca quando aparece na tela: fora dela fica parado e não gasta bateria nem dados.
 * - Quem pediu "reduzir movimento" no aparelho vê o vídeo parado, com botão de play.
 * - Precisa estar mudo e com playsInline: sem isso o iPhone não deixa tocar sozinho.
 * - No carrossel: `active` false deixa o vídeo parado no começo, `loop` false faz o vídeo acabar
 *   (e `onEnded` avisar o carrossel para passar ao próximo).
 */
export function DemoVideo({
  wide,
  tall,
  label,
  active = true,
  loop = true,
  onEnded,
}: {
  wide: string
  tall: string
  label: string
  active?: boolean
  loop?: boolean
  onEnded?: () => void
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const narrow = useMedia('(max-width: 640px)')
  const still = useMedia('(prefers-reduced-motion: reduce)') === true
  const src = narrow === null ? undefined : narrow ? tall : wide

  useEffect(() => {
    const video = ref.current
    if (!video || !src || still) return
    if (!active) {
      video.pause()
      video.currentTime = 0
      return
    }
    const watcher = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {})
      else video.pause()
    })
    watcher.observe(video)
    return () => watcher.disconnect()
  }, [src, still, active])

  return (
    <div className="demo-box">
      <video
        ref={ref}
        src={src}
        muted
        loop={loop}
        onEnded={onEnded}
        playsInline
        preload="metadata"
        controls={still}
        aria-label={label}
      />
    </div>
  )
}
