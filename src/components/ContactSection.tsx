import { ContactForm } from './ContactForm'

type Props = {
  /** Link do WhatsApp já pronto (ou null se não houver número no /admin). */
  whatsapp: string | null
  email?: string | null
  /** Slug do projeto quando a pessoa veio de "Quer algo parecido?". */
  source?: string
}

/**
 * Chamada para clientes no fim da página: quem rolou o feed inteiro
 * e se interessou encontra aqui um jeito fácil de falar com você.
 * O id="contato" permite levar a pessoa direto para cá com o link /#contato.
 */
export function ContactSection({ whatsapp, email, source }: Props) {
  return (
    <section id="contato" className="contact-cta" aria-labelledby="contato-titulo">
      <div className="contact-intro">
        <h2 id="contato-titulo">Tem um processo manual tomando tempo da sua equipe?</h2>
        <p>
          Conte o problema em poucas linhas. Eu respondo com uma ideia de como automatizar ou
          resolver, sem compromisso.
        </p>
        {(whatsapp || email) && (
          <p className="contact-alt">
            Prefere falar direto?{' '}
            {whatsapp && (
              <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            )}
            {whatsapp && email && ' ou '}
            {email && <a href={`mailto:${email}`}>{email}</a>}
          </p>
        )}
      </div>
      <ContactForm source={source} />
    </section>
  )
}
