'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

import { countView } from '@/app/(frontend)/views'

/**
 * Avisa o servidor a cada página aberta. Roda no navegador, então robôs
 * que não executam JavaScript (a maioria dos buscadores) não contam.
 */
export function ViewCounter() {
  const path = usePathname()

  useEffect(() => {
    let firstVisit = true
    try {
      const key = `visto:${path}`
      firstVisit = !localStorage.getItem(key)
      localStorage.setItem(key, '1')
    } catch {
      // Navegação privada pode bloquear o localStorage: conta como primeira visita.
    }

    // Origem: só na primeira página da visita (a aba guarda um aviso até fechar).
    // Mandamos só o nome do site de origem, nunca o endereço completo.
    let origin: { utm?: string; referrer?: string } | undefined
    try {
      if (!sessionStorage.getItem('visita')) {
        sessionStorage.setItem('visita', '1')
        const referrer = document.referrer ? new URL(document.referrer).hostname : ''
        origin = {
          utm: new URLSearchParams(location.search).get('utm_source') ?? undefined,
          // Vinda do próprio site não é origem nova.
          referrer: referrer === location.hostname ? undefined : referrer,
        }
      }
    } catch {
      // sessionStorage bloqueado ou referrer inválido: conta só a visualização.
    }
    countView(path, firstVisit, origin)
  }, [path])

  return null
}
