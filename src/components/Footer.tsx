import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'

import config from '@/payload.config'

/**
 * Rodapé do site em três áreas: marca, navegação e contato.
 * Os dados de contato vêm do Perfil (/admin); o que estiver vazio não aparece.
 * Se o banco falhar, o rodapé ainda mostra marca e navegação em vez de derrubar a página.
 */
export async function Footer() {
  const profile = await getPayload({ config })
    .then((payload) => payload.findGlobal({ slug: 'profile', depth: 0 }))
    .catch(() => null)

  const email = profile?.links?.email
  const social = [
    { label: 'LinkedIn', href: profile?.links?.linkedin },
    { label: 'GitHub', href: profile?.links?.github },
  ].filter((link): link is { label: string; href: string } => Boolean(link.href))

  return (
    <footer className="foot band-dark">
      <div className="foot-grid">
        <div className="foot-brand">
          <Image src="/marca/logo-escuro.png" alt="Gui Mitter" width={200} height={40} />
          <p>
            <b>Gui Mitter</b>
            <br />
            Automações e sistemas
          </p>
        </div>
        <nav aria-label="Rodapé">
          <h2>Navegação</h2>
          <ul>
            <li><Link href="/">Início</Link></li>
            <li><Link href="/portfolio">Projetos</Link></li>
            <li><Link href="/portfolio#tecnologias-titulo">Tecnologias</Link></li>
            <li><Link href="/#contato">Contato</Link></li>
          </ul>
        </nav>
        <div>
          <h2>Contato</h2>
          <ul>
            <li>{profile?.location ?? 'Belo Horizonte, MG'}</li>
            {email && (
              <li>
                <a href={`mailto:${email}`}>{email}</a>
              </li>
            )}
            {social.map((link) => (
              <li key={link.label}>
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="foot-copy">© 2026 Gui Mitter. Todos os direitos reservados.</p>
    </footer>
  )
}
