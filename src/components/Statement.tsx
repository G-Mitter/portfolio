import type React from 'react'

/**
 * Frase de destaque logo abaixo do topo. Cada palavra é um <span> com o seu número (--i):
 * no CSS, a palavra passa de cinza para cheia conforme a página rola, uma depois da outra.
 * Sem suporte do navegador, ou com "reduzir movimento", o texto aparece inteiro.
 */
const TEXT =
  'Sua equipe copia dados de PDF para planilha, confere relatório à mão e refaz a mesma conta toda semana. Eu transformo isso em um processo que roda sozinho.'
// Trechos que ganham a cor de destaque (o resto fica na cor do texto).
const HIGHLIGHTS = ['copia dados de PDF', 'confere relatório à mão', 'roda sozinho']
const WORDS = TEXT.split(' ')
const marked = new Set<number>()
for (const phrase of HIGHLIGHTS) {
  const size = phrase.split(' ').length
  const start = WORDS.findIndex((_, i) => WORDS.slice(i, i + size).join(' ').replace(/[.,]$/, '') === phrase)
  for (let i = start; start >= 0 && i < start + size; i++) marked.add(i)
}

export function Statement() {
  return (
    <section className="band band-dark statement-band">
      <p className="statement">
        {WORDS.map((word, i) => (
          <span className={marked.has(i) ? 'w key' : 'w'} style={{ '--i': i } as React.CSSProperties} key={i}>
            {word}{' '}
          </span>
        ))}
      </p>
    </section>
  )
}
