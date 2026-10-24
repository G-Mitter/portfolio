import Image from 'next/image'
import type React from 'react'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { initials } from '@/lib/initials'
import { contactMessage, whatsappUrl } from '@/lib/whatsapp'
import type { Profile } from '@/payload-types'

// Linhas da faixa decorativa: o que uma planilha manual vira quando alguém automatiza.
const SHEET_ROWS = [
  ['extrato.pdf', 'lido'],
  ['notas.xlsx', 'conferido'],
  ['metas.csv', 'enviado'],
]

/**
 * Topo da página inicial: quem você é, o que resolve e para onde ir.
 * O botão principal leva ao contato; o outro, ao portfólio.
 * No computador: texto à esquerda e foto à direita, em retrato com cantos arredondados.
 * No celular: foto em cima, texto embaixo.
 */
export function Intro({ profile, projectCount }: { profile: Profile; projectCount: number }) {
  const avatar = typeof profile.avatar === 'object' ? profile.avatar : null
  const whatsapp = whatsappUrl(profile.links?.whatsapp, contactMessage(profile.name))

  return (
    <header className="intro">
      <div className="intro-text">
        <p className="intro-name">
          {profile.name}
          {profile.role && ` · ${profile.role}`}
          {profile.location && <span className="loc"> · {profile.location}</span>}
        </p>
        {profile.bio && <h1>{profile.bio}</h1>}
        {profile.available && (
          <Badge asChild variant="available" className="available">
            <a href="#contato">
              <i aria-hidden="true" />
              Disponível para projetos
            </a>
          </Badge>
        )}
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
          <Button asChild size="lg">
            <Link href="/portfolio">Ver meus projetos</Link>
          </Button>
        </div>
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
        {/* Faixa decorativa: as linhas se preenchem uma a uma ao abrir a página (só CSS). */}
        <div className="sheet" aria-hidden="true">
          {['A', 'B', ''].map((head, i) => (
            <span className="sheet-head" key={i}>
              {head}
            </span>
          ))}
          {SHEET_ROWS.map(([file, state], row) =>
            [file, state, '✓'].map((cell, col) => (
              <span
                className={col === 2 ? 'sheet-cell sheet-ok' : 'sheet-cell'}
                style={{ '--i': row } as React.CSSProperties}
                key={`${row}-${col}`}
              >
                {cell}
              </span>
            )),
          )}
        </div>
      </div>
      <div className="intro-photo">
        {avatar?.url ? (
          <Image
            src={avatar.url}
            alt={avatar.alt}
            fill
            sizes="(max-width: 640px) 100vw, 340px"
            priority
          />
        ) : (
          <span aria-hidden="true">{initials(profile.name)}</span>
        )}
      </div>
    </header>
  )
}
