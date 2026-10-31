'use client'

import { useState } from 'react'

/** Baixa todos os arquivos do post: clica em cada link "⬇" ao lado, um por vez (o navegador pode pedir para permitir vários downloads). */
export function DownloadAll() {
  return (
    <button
      type="button"
      className="mkt-all"
      onClick={(e) =>
        e.currentTarget.parentElement
          ?.querySelectorAll<HTMLAnchorElement>('a[download]')
          .forEach((a, i) => setTimeout(() => a.click(), i * 500))
      }
    >
      ⬇ Baixar tudo
    </button>
  )
}

/** Texto da legenda com botão de copiar (no celular, sem baixar o .md). */
export function CopyText({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="mkt-text">
      <pre>{text}</pre>
      <button
        type="button"
        aria-label="Copiar texto"
        title="Copiar texto"
        onClick={async () => {
          await navigator.clipboard.writeText(text)
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        }}
      >
        {copied ? '✓ Copiado!' : '⧉ Copiar'}
      </button>
    </div>
  )
}
