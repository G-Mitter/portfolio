import { Bricolage_Grotesque, IBM_Plex_Sans, JetBrains_Mono } from 'next/font/google'
import type { Metadata } from 'next'
import React from 'react'

import './styles.css'

/**
 * next/font baixa as fontes do Google no momento do build e serve
 * junto com o site. Assim o visitante não depende do servidor do Google
 * e a página não "pisca" trocando de fonte.
 * Cada fonte vira uma variável CSS (--font-display etc.) usada no styles.css.
 */
const display = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-display' })
const body = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
})
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: {
    default: 'Guilherme Mitter · Portfólio',
    template: '%s · Guilherme Mitter',
  },
  description:
    'Projetos de automação, web e IA de Guilherme Mitter, desenvolvedor em Belo Horizonte.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <main className="wrap">{children}</main>
      </body>
    </html>
  )
}
