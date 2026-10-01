import Image from 'next/image'

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
  const contact = profile.links?.email ? `mailto:${profile.links.email}` : profile.links?.linkedin

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
          {contact && (
            <a className="btn primary" href={contact} target="_blank" rel="noopener noreferrer">
              Fale comigo
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
        </p>
      </div>
    </header>
  )
}
