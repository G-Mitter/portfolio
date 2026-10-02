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
    countView(path, firstVisit)
  }, [path])

  return null
}
