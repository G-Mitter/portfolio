import Image from 'next/image'

import { whatsappUrl } from '@/lib/whatsapp'
import type { Profile } from '@/payload-types'

type Props = {
  profile: Profile
  projectCount: number
}

/** Iniciais do nome para o avatar quando ainda não há foto. Ex.: "Guilherme Mitter" -> "GM" */
function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

export function ProfileHeader({ profile, projectCount }: Props) {
  const avatar = typeof profile.avatar === 'object' ? profile.avatar : null
  const resume = typeof profile.links?.resume === 'object' ? profile.links.resume : null
  const email = profile.links?.email
  const firstName = profile.name.split(' ')[0]
  // A mensagem já vem escrita: quem clica só precisa apertar "enviar".
  const whatsapp = whatsappUrl(
    profile.links?.whatsapp,
    `Olá, ${firstName}! Vi seu portfólio e gostaria de conversar.`,
  )

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
          {/* O WhatsApp é o botão principal; sem ele, o e-mail assume o destaque. */}
          {whatsapp && (
            <a className="btn whatsapp" href={whatsapp} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          )}
          {email && (
            <a className={whatsapp ? 'btn' : 'btn primary'} href={`mailto:${email}`}>
              E-mail
            </a>
          )}
          {profile.links?.linkedin && (
            <a
              className="btn"
              href={profile.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          )}
          {profile.links?.github && (
            <a
              className="btn"
              href={profile.links.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          )}
          {resume?.url && (
            <a className="btn" href={resume.url} target="_blank" rel="noopener noreferrer">
              Currículo
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
        <p className="bio">
          <span className="role">
            {profile.name}
            {profile.role && ` · ${profile.role}`}
          </span>
          {profile.bio && (
            <>
              <br />
              {profile.bio}
            </>
          )}
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
      </div>
    </header>
  )
}
