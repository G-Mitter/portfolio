import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { IntroDemo } from '@/components/IntroDemo'
import { contactMessage, whatsappUrl } from '@/lib/whatsapp'
import type { Profile } from '@/payload-types'

/**
 * Topo da página inicial: quem é, o que resolve e uma única ação (agendar o diagnóstico).
 * Faixa escura de ponta a ponta: texto à esquerda e, à direita, um exemplo do que o robô entrega
 * (carrossel de exemplos, dados fictícios). A foto do Guilherme fica na seção "Quem faz", mais abaixo.
 * O selo "Disponível" fica no canto superior direito. No celular, o exemplo vem depois do texto.
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
          {profile.name} · {profile.role}
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
                Agendar diagnóstico grátis de 30 min
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
        <p className="intro-note">Sem compromisso. Preço fechado antes de começar.</p>
      </div>
      <IntroDemo />
      {/* O nome segue como <h1> para leitores de tela e buscadores, mas só aparece na linha acima da frase. */}
      <h1 className="sr-only">{profile.name}</h1>
    </header>
  )
}
