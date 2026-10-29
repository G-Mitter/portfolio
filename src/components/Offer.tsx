import { Button } from '@/components/ui/button'

/**
 * "Como começar": as condições para o primeiro projeto, logo depois de "Como eu trabalho".
 * Responde ao "quanto custa e qual o meu risco?" antes que o cliente precise perguntar.
 * Os textos ficam aqui no código (como a linha do tempo); mude aqui se as condições mudarem.
 */
const TERMS = [
  { title: 'Diagnóstico grátis', text: 'Uma conversa online de 30 minutos para entender o processo e ver se dá para automatizar.' },
  { title: 'Preço fechado', text: 'Você sabe quanto vai pagar antes de começar. Sem surpresa no fim.' },
  { title: '50% agora, 50% funcionando', text: 'Metade no início e a outra metade só quando a automação estiver rodando.' },
  { title: '30 dias de ajustes', text: 'Depois da entrega, qualquer ajuste nos primeiros 30 dias está incluído.' },
]

export function Offer({ whatsapp }: { whatsapp: string | null }) {
  return (
    <section className="offer band band-dark" aria-labelledby="oferta-titulo">
      <h2 id="oferta-titulo">Como começar</h2>
      <p>O seu risco é pequeno: você só paga a segunda metade quando estiver funcionando.</p>
      <ul>
        {TERMS.map((term) => (
          <li key={term.title}>
            <h3>{term.title}</h3>
            <p>{term.text}</p>
          </li>
        ))}
      </ul>
      {/* Sem número no /admin, o botão leva ao formulário de contato. */}
      <Button asChild size="lg" variant={whatsapp ? 'whatsapp' : 'default'}>
        <a href={whatsapp ?? '#contato'} {...(whatsapp && { target: '_blank', rel: 'noopener noreferrer' })}>
          Agendar diagnóstico grátis
        </a>
      </Button>
    </section>
  )
}
