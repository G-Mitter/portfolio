import Image from 'next/image'
import Link from 'next/link'

import { initials } from '@/lib/initials'
import { contactMessage, whatsappUrl } from '@/lib/whatsapp'
import type { Profile } from '@/payload-types'

/**
 * Topo da página inicial: quem você é, o que resolve e para onde ir.
 * O botão principal leva ao portfólio; os outros, direto ao contato.
 */
export function Intro({ profile }: { profile: Profile }) {
  const avatar = typeof profile.avatar === 'object' ? profile.avatar : null
  const whatsapp = whatsappUrl(profile.links?.whatsapp, contactMessage(profile.name))

  return (
    <header className="intro">
      <div className="avatar">
        {avatar?.url ? (
          <Image src={avatar.url} alt={avatar.alt} fill sizes="132px" priority />
        ) : (
          <span aria-hidden="true">{initials(profile.name)}</span>
        )}
      </div>
      <p className="intro-name">
        {profile.name}
        {profile.role && ` · ${profile.role}`}
        {profile.location && <span className="loc"> · {profile.location}</span>}
      </p>
      {profile.bio && <h1>{profile.bio}</h1>}
      {profile.available && (
        <a className="available" href="#contato">
          <i aria-hidden="true" />
          Disponível para projetos
        </a>
      )}
      <div className="p-actions">
        <Link className="btn primary" href="/portfolio">
          Ver meus projetos
        </Link>
        <a className="btn" href="#contato">
          Falar sobre meu projeto
        </a>
        {whatsapp && (
          <a className="btn whatsapp" href={whatsapp} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
        )}
      </div>
    </header>
  )
}
