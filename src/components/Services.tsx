import type { Profile } from '@/payload-types'

/** Caminhos SVG (traço) dos ícones; o /admin não tem campo de ícone, então ele sai do título. */
const ICONS = {
  bot: 'M12 8V4H8M4 8h16v12H4zM2 14h2M20 14h2M15 13v2M9 13v2',
  code: 'm18 16 4-4-4-4M6 8l-4 4 4 4M14.5 4l-5 16',
  chart: 'M3 3v16a2 2 0 0 0 2 2h16M18 17V9M13 17V5M8 17v-3',
  bolt: 'M13 2 3 14h9l-1 8 10-12h-9z',
}

function iconFor(title: string) {
  const t = title.toLowerCase()
  if (/autom|rob[ôo]|tarefa/.test(t)) return ICONS.bot
  if (/sistem|site|app|medida|c[óo]digo/.test(t)) return ICONS.code
  if (/dado|relat|planilha|dashboard|gr[áa]fic/.test(t)) return ICONS.chart
  return ICONS.bolt
}

/**
 * "Como posso ajudar": os serviços cadastrados em /admin > Perfil.
 * Fica logo antes do formulário de contato, para o cliente ler o que você
 * resolve e já ter onde escrever. Sem serviços cadastrados, a seção some.
 */
export function Services({ services }: { services: Profile['services'] }) {
  if (!services?.length) return null

  return (
    <section className="services band band-dark" aria-labelledby="servicos-titulo">
      <h2 id="servicos-titulo">Como posso ajudar</h2>
      <ul>
        {services.map((service) => (
          <li key={service.id ?? service.title}>
            <h3>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d={iconFor(service.title)} />
              </svg>
              {service.title}
            </h3>
            <p>{service.description}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
