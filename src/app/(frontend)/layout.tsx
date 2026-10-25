import { Bricolage_Grotesque, JetBrains_Mono, Schibsted_Grotesk } from 'next/font/google'
import type { Metadata, Viewport } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { ViewCounter } from '@/components/ViewCounter'
import { siteUrl } from '@/lib/siteUrl'

import './tailwind.css'
import './styles.css'

/**
 * next/font baixa as fontes do Google no momento do build e serve
 * junto com o site. Assim o visitante não depende do servidor do Google
 * e a página não "pisca" trocando de fonte.
 * Cada fonte vira uma variável CSS (--font-display etc.) usada no styles.css.
 */
// wdth libera o modo condensado (font-stretch) usado nos títulos grandes do topo.
const display = Bricolage_Grotesque({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-display',
})
const body = Schibsted_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
})
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

// O Next usa o endereço completo para links relativos nos metadados, como a
// imagem de prévia (og:image) que o LinkedIn e o WhatsApp mostram ao compartilhar.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Guilherme Mitter (guimitter) · Automações em Belo Horizonte e Santa Luzia',
    template: '%s · Guilherme Mitter',
  },
  description:
    'Guilherme Mitter (guimitter), desenvolvedor de automações, sites e IA em Santa Luzia e Belo Horizonte. Veja os projetos e peça um orçamento.',
  // Prévia ao compartilhar o link (LinkedIn, WhatsApp). O Next completa url e imagem de cada página.
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Guilherme Mitter',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Guilherme Mitter, automações em Santa Luzia e Belo Horizonte' }],
  },
  twitter: { card: 'summary_large_image' },
}

// Cor da barra do navegador no celular, igual ao fundo escuro da abertura.
export const viewport: Viewport = { themeColor: '#141a28' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        {/* Quem navega pelo teclado pula direto para o conteúdo (o link só aparece ao receber foco). */}
        <a className="skip" href="#conteudo">
          Pular para o conteúdo
        </a>
        <main className="wrap" id="conteudo">{children}</main>
        {/* Rodapé sempre escuro (como o topo e o contato), por isso a logo é a versão para fundo escuro. */}
        <footer className="foot band-dark">
          <nav className="foot-nav" aria-label="Rodapé">
            <Link href="/">Início</Link>
            <Link href="/portfolio">Portfólio</Link>
            <Link href="/#contato">Contato</Link>
          </nav>
          <div className="foot-base">
            <Image src="/marca/logo-escuro.png" alt="Guilherme Mitter Automações" width={200} height={40} />
            <p>Automações em Belo Horizonte e região</p>
          </div>
        </footer>
        {/* Conta as visualizações de cada página para mostrar em /admin > Visualizações. */}
        <ViewCounter />
      </body>
    </html>
  )
}
