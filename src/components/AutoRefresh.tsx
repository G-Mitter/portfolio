'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Pede os dados de novo ao servidor a cada `seconds` segundos, sem recarregar a página.
 * Isso é "polling": o navegador pergunta de tempos em tempos se há novidade.
 * Pausa com a aba escondida, para não gastar o banco à toa.
 */
export function AutoRefresh({ seconds = 30 }: { seconds?: number }) {
  const router = useRouter()

  useEffect(() => {
    const id = setInterval(() => {
      if (!document.hidden) router.refresh()
    }, seconds * 1000)
    return () => clearInterval(id)
  }, [router, seconds])

  return null
}
