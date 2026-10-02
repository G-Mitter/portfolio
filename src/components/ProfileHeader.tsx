import Image from 'next/image'

import { initials } from '@/lib/initials'
import { instagramUrl } from '@/lib/instagram'
import { contactMessage, whatsappUrl } from '@/lib/whatsapp'
import type { Profile } from '@/payload-types'

type Props = {
  profile: Profile
  projectCount: number
}

export function ProfileHeader({ profile, projectCount }: Props) {
  const avatar = typeof profile.avatar === 'object' ? profile.avatar : null
  const resume = typeof profile.links?.resume === 'object' ? profile.links.resume : null
  const email = profile.links?.email
  const instagram = instagramUrl(profile.links?.instagram)
  const whatsapp = whatsappUrl(profile.links?.whatsapp, contactMessage(profile.name))

  // Links secundários (recrutador e redes): ficam numa linha discreta abaixo da bio,
  // para os dois botões de contato serem o que mais chama atenção no topo.
  const links = [
    { label: 'LinkedIn', href: profile.links?.linkedin },
    { label: 'GitHub', href: profile.links?.github },
    { label: 'Instagram', href: instagram },
    { label: 'Currículo (PDF)', href: resume?.url },
  ].filter((link): link is { label: string; href: string } => Boolean(link.href))

  return (
    <header className="profile">
      <div className="avatar">
        {avatar?.url ? (
          <Image src={avatar.url} alt={avatar.alt} fill sizes="132px" />
        ) : (
          <span aria-hidden="true">{initials(profile.name)}</span>
        )}
      </div>
      <div className="p-info">
        <div className="p-head">
          <h1 className="handle">{profile.handle ?? profile.name}</h1>
          {/* Botão principal: leva ao formulário no fim da página. */}
          <a className="btn primary" href="#contato">
            Falar sobre meu projeto
          </a>
          {whatsapp && (
            <a className="btn whatsapp" href={whatsapp} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          )}
        </div>
        <ul className="stats">
          <li>
            <b>{projectCount}</b> <span>projetos</span>
          </li>
          {profile.stats?.map((stat) => (
            <li key={stat.id ?? stat.label}>
              <b>{stat.value}</b> <span>{stat.label}</span>
            </li>
          ))}
        </ul>
        {/* Selo que diz na hora que você aceita trabalho; liga e desliga no /admin.
            Fica fora da linha dos botões para não empurrar nenhum para baixo. */}
        {profile.available && (
          <a className="available" href="#contato">
            <i aria-hidden="true" />
            Disponível para projetos
          </a>
        )}
        {/* A bio é a promessa para o cliente, por isso vem primeiro e em destaque. */}
        {profile.bio && <p className="headline">{profile.bio}</p>}
        <p className="bio">
          <span className="role">
            {profile.name}
            {profile.role && ` · ${profile.role}`}
          </span>
          {profile.location && (
            <>
              <br />
              <span className="loc">{profile.location}</span>
            </>
          )}
          {/* O e-mail aparece escrito por extenso para quem quiser copiar. */}
          {email && (
            <>
              <br />
              <a className="contact" href={`mailto:${email}`}>
                {email}
              </a>
            </>
          )}
        </p>
        {links.length > 0 && (
          <p className="p-links">
            {links.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">
                {link.label}
              </a>
            ))}
          </p>
        )}
      </div>
    </header>
  )
}
