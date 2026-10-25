'use client'

import { useEffect, useState } from 'react'

// Diagnóstico temporário (só com ?debug no endereço): mostra na tela quem deixa a página mais larga que o celular.
export function OverflowDebug() {
  const [text, setText] = useState('')

  useEffect(() => {
    if (!location.search.includes('debug')) return
    const run = () => {
      const w = document.documentElement.clientWidth
      const rows: string[] = []
      document.querySelectorAll('body *').forEach((el) => {
        const r = el.getBoundingClientRect()
        const fixed = getComputedStyle(el).position === 'fixed'
        if (r.width && (r.right > w + 1 || el.scrollWidth > el.clientWidth + 1 && el.clientWidth > 0))
          rows.push(`${fixed ? 'F ' : ''}${el.tagName.toLowerCase()}.${String(el.className).slice(0, 28)} r=${Math.round(r.right)} sw=${el.scrollWidth} cw=${el.clientWidth}`)
      })
      setText(
        `inner=${innerWidth} client=${w} docSW=${document.documentElement.scrollWidth} bodySW=${document.body.scrollWidth} vv=${Math.round(visualViewport?.width ?? 0)} scrollX=${Math.round(scrollX)}\n${rows.slice(0, 40).join('\n')}`,
      )
    }
    const t = setTimeout(run, 3000)
    addEventListener('click', run)
    return () => { clearTimeout(t); removeEventListener('click', run) }
  }, [])

  if (!text) return null
  return (
    <pre style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999, margin: 0, padding: 6, maxWidth: '100vw', maxHeight: '70vh', overflow: 'hidden', background: '#000d', color: '#0f0', font: '10px/1.2 monospace', whiteSpace: 'pre-wrap', pointerEvents: 'none' }}>
      {text}
    </pre>
  )
}
