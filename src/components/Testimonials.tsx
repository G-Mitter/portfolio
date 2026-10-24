import Image from 'next/image'

import { initials } from '@/lib/initials'
import type { Profile } from '@/payload-types'

/**
 * "Recomendações": o que outras pessoas dizem do seu trabalho, cadastrado em /admin > Perfil.
 * Fica logo antes do formulário: é a última coisa que o cliente lê antes de decidir escrever.
 * Usa <figure> + <blockquote> + <figcaption>, a forma do HTML de dizer "citação e quem disse".
 * Sem recomendações cadastradas, a seção some.
 */
export function Testimonials({ testimonials }: { testimonials: Profile['testimonials'] }) {
  if (!testimonials?.length) return null

  return (
    <section className="testimonials" aria-labelledby="recomendacoes-titulo">
      <h2 id="recomendacoes-titulo">Recomendações</h2>
      <ul>
        {testimonials.map((item) => {
          const photo = typeof item.photo === 'object' ? item.photo : null
          return (
            <li key={item.id ?? item.name}>
              <figure>
                <blockquote>{item.quote}</blockquote>
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
                    {item.role && <small>{item.role}</small>}
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
