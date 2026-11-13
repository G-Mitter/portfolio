import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { contactMessage, whatsappUrl } from '@/lib/whatsapp'

/** Links do cabeçalho. Os #...-titulo são os ids dos títulos de cada seção da home. */
const LINKS = [
  { label: 'Projetos', href: '/portfolio' },
  { label: 'Serviços', href: '/#servicos-titulo' },
  { label: 'Como funciona', href: '/#processo-titulo' },
  { label: 'Perguntas', href: '/#faq-titulo' },
  { label: 'Contato', href: '/#contato' },
]

/**
 * Cabeçalho fixo no topo: logo, navegação e o botão do WhatsApp sempre à vista.
 * Lê o Perfil só para o número do WhatsApp; se o banco falhar, o botão vira "Contato".
 * No celular, o menu é um <details> nativo (abre e fecha sem JavaScript, funciona no teclado).
 */
export async function SiteHeader() {
  const profile = await getPayload({ config })
    .then((payload) => payload.findGlobal({ slug: 'profile', depth: 0 }))
    .catch(() => null)
  const whatsapp = whatsappUrl(profile?.links?.whatsapp, contactMessage(profile?.name ?? 'Guilherme'))

  return (
    <header className="site-header">
      <div className="sh-bar">
        <Link href="/" className="sh-logo" aria-label="Gui Mitter, página inicial">
          <Image src="/marca/logo-escuro.png" alt="" width={202} height={40} priority />
        </Link>
        <nav className="sh-nav" aria-label="Principal">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href}>{l.label}</Link>
          ))}
        </nav>
        <a
          className="sh-cta"
          href={whatsapp ?? '/#contato'}
          {...(whatsapp ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {whatsapp ? 'WhatsApp' : 'Contato'}
        </a>
        <details className="sh-menu">
          <summary>Menu</summary>
          <nav aria-label="Principal (celular)">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href}>{l.label}</Link>
            ))}
          </nav>
        </details>
      </div>
    </header>
  )
}
