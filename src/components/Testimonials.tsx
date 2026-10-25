import Image from 'next/image'

import { initials } from '@/lib/initials'
import type { Profile } from '@/payload-types'

/** Endereço cru escrito no /admin vira link clicável ("Visitar site ↗"); só http(s). */
function linkify(text: string, named = false) {
  // "Nome https://site" (campo do cargo): o próprio nome vira o link.
  const withName = named ? text.match(/^(.+?)\s+(https?:\/\/\S+)$/) : null
  if (withName) {
    return (
      <a href={withName[2]} target="_blank" rel="noopener noreferrer">
        {withName[1]} ↗<span className="sr-only"> (abre em nova aba)</span>
      </a>
    )
  }
  return text.split(/(https?:\/\/\S+)/).map((part, i) =>
    /^https?:\/\//.test(part) ? (
      <a key={i} href={part} target="_blank" rel="noopener noreferrer">
        Visitar site ↗<span className="sr-only"> (abre em nova aba)</span>
      </a>
    ) : (
      part
    ),
  )
}

/**
 * "Recomendações": o que outras pessoas dizem do seu trabalho, cadastrado em /admin > Perfil.
 * Fica logo antes do formulário: é a última coisa que o cliente lê antes de decidir escrever.
 * Usa <figure> + <blockquote> + <figcaption>, a forma do HTML de dizer "citação e quem disse".
 * Sem recomendações cadastradas, a seção some.
 */
export function Testimonials({ testimonials }: { testimonials: Profile['testimonials'] }) {
  if (!testimonials?.length) return null

  return (
    <section className="testimonials band band-dark" aria-labelledby="recomendacoes-titulo">
      <h2 id="recomendacoes-titulo">Recomendações</h2>
      <ul>
        {testimonials.map((item) => {
          const photo = typeof item.photo === 'object' ? item.photo : null
          return (
            <li key={item.id ?? item.name}>
              <figure>
                <blockquote>{linkify(item.quote)}</blockquote>
                <figcaption>
                  <span className="t-photo">
                    {photo?.url ? (
                      <Image src={photo.url} alt="" fill sizes="44px" />
                    ) : (
                      <span aria-hidden="true">{initials(item.name)}</span>
                    )}
                  </span>
                  <span>
                    <b>{item.name}</b>
                    {item.role && <small>{linkify(item.role, true)}</small>}
                  </span>
                </figcaption>
              </figure>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
