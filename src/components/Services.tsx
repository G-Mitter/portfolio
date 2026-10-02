import type { Profile } from '@/payload-types'

/**
 * "Como posso ajudar": os serviços cadastrados em /admin > Perfil.
 * Fica logo antes do formulário de contato, para o cliente ler o que você
 * resolve e já ter onde escrever. Sem serviços cadastrados, a seção some.
 */
export function Services({ services }: { services: Profile['services'] }) {
  if (!services?.length) return null

  return (
    <section className="services" aria-labelledby="servicos-titulo">
      <h2 id="servicos-titulo">Como posso ajudar</h2>
      <ul>
        {services.map((service) => (
          <li key={service.id ?? service.title}>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
