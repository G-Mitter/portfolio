import Image from 'next/image'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { contactMessage, whatsappUrl } from '@/lib/whatsapp'
import type { Profile } from '@/payload-types'

/**
 * Topo da página inicial: quem você é, o que resolve e para onde ir.
 * O botão principal leva ao contato; o outro, ao portfólio.
 * Faixa escura de ponta a ponta: texto à esquerda, foto recortada sobre um disco azul
 * à direita e o nome em letras enormes, centralizado, cruzando a base da foto.
 * O selo "Disponível" fica no canto superior direito.
 * No celular: foto em cima, nome e texto embaixo.
 */
export function Intro({ profile, projectCount }: { profile: Profile; projectCount: number }) {
  const whatsapp = whatsappUrl(profile.links?.whatsapp, contactMessage(profile.name))

  return (
    <header className="intro">
      {profile.available && (
        <Badge asChild variant="available" className="available">
          <a href="#contato">
            <i aria-hidden="true" />
            Disponível para projetos
          </a>
        </Badge>
      )}
      <div className="intro-text">
        <p className="intro-name">
          {profile.role}
          {profile.location && <span className="loc"> · {profile.location}</span>}
        </p>
        {profile.bio && <p className="lead">{profile.bio}</p>}
        {profile.support && <p className="support">{profile.support}</p>}
        {/* Números que provam o trabalho, os mesmos do topo do portfólio. */}
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
        {/* O botão de destaque leva ao contato (WhatsApp, ou o formulário se não houver número):
            é a ação que a página quer. Ver os projetos fica como segunda opção. */}
        <div className="p-actions">
          {whatsapp ? (
            <Button asChild size="lg" variant="whatsapp">
              <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                Conversar no WhatsApp
              </a>
            </Button>
          ) : (
            <Button asChild size="lg" variant="default">
              <a href="#contato">Falar sobre meu projeto</a>
            </Button>
          )}
          <Button asChild size="lg" className="border-primary">
            <Link href="/portfolio">Ver meus projetos</Link>
          </Button>
        </div>
      </div>
      {/* Recorte sem fundo (public/): o disco azul fica atrás, no CSS. */}
      <div className="intro-photo">
        <Image
          src="/guilherme-recorte.png"
          alt={`Foto de ${profile.name}`}
          width={1086}
          height={1448}
          sizes="(max-width: 640px) 80vw, 640px"
          priority
        />
      </div>
      <h1 className="intro-big">{profile.name}</h1>
    </header>
  )
}
