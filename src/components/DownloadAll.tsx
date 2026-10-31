'use client'

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
