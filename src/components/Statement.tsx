import type React from 'react'

/**
 * Frase de destaque logo abaixo do topo. Cada palavra é um <span> com o seu número (--i):
 * no CSS, a palavra passa de cinza para cheia conforme a página rola, uma depois da outra.
 * Sem suporte do navegador, ou com "reduzir movimento", o texto aparece inteiro.
 */
const TEXT =
  'Sua equipe copia dados de PDF para planilha, confere relatório à mão e refaz a mesma conta toda semana. Eu transformo isso em um processo que roda sozinho.'

export function Statement() {
  return (
    <section className="band band-light statement-band">
      <p className="statement">
        {TEXT.split(' ').map((word, i) => (
          <span className="w" style={{ '--i': i } as React.CSSProperties} key={i}>
            {word}{' '}
          </span>
        ))}
      </p>
    </section>
  )
}
