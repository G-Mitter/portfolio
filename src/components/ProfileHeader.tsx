import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { instagramUrl } from '@/lib/instagram'
import { contactMessage, whatsappUrl } from '@/lib/whatsapp'
import type { Profile } from '@/payload-types'

type Props = {
  profile: Profile
  projectCount: number
}

export function ProfileHeader({ profile, projectCount }: Props) {
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
      {/* Mesmo recorte sem fundo da home (public/); o disco azul e a animação vêm do CSS de .intro-photo. */}
      <div className="intro-photo p-photo">
        <Image
          src="/guilherme-recorte.png"
          alt={`Foto de ${profile.name}`}
          width={970}
          height={1240}
          sizes="(max-width: 640px) 104px, 300px"
          priority
        />
      </div>
      <div className="p-info">
        <div className="p-head">
          {/* Nome e selo "Disponível" juntos; o selo liga e desliga no /admin. */}
          <div className="p-id">
            <h1 className="handle">{profile.handle ?? profile.name}</h1>
            {profile.available && (
              <Badge asChild variant="available" className="available">
                <Link href="/#contato">
                  <i aria-hidden="true" />
                  Disponível para projetos
                </Link>
              </Badge>
            )}
          </div>
          {/* Os dois botões de contato ficam juntos: no celular viram uma linha inteira. */}
          <div className="p-actions">
            {/* Botão principal: leva ao formulário da página inicial. */}
            <Button asChild variant="default">
              <Link href="/#contato">Falar sobre meu projeto</Link>
            </Button>
            {whatsapp && (
              <Button asChild variant="whatsapp">
                <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </Button>
            )}
          </div>
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
        {/* A bio é a promessa para o cliente, por isso vem primeiro e em destaque. */}
        {profile.bio && <p className="headline">{profile.bio}</p>}
        <p className="bio">
          <span className="role">{profile.name}</span>
          {profile.role && (
            <>
              <br />
              <span className="job">{profile.role}</span>
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
