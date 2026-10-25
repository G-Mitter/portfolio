'use client'

/**
 * Botão flutuante do WhatsApp (home e portfólio).
 *
 * Quando aparece: depois que o topo (.intro na home, .profile no portfólio) sai da tela (quem acabou de chegar já vê o botão grande dela).
 * Quando some: com o formulário de contato ou o rodapé à vista, para não cobrir campos nem links.
 * O IntersectionObserver avisa quando cada pedaço entra ou sai da tela, sem ouvir a rolagem inteira.
 */
import { useEffect, useState } from 'react'

export function WhatsAppFloat({ href }: { href: string }) {
  const [pastIntro, setPastIntro] = useState(false)
  const [inContact, setInContact] = useState(false)
  const [inFooter, setInFooter] = useState(false)

  useEffect(() => {
    const intro = document.querySelector('.intro, .profile')
    const contact = document.querySelector('#contato')
    const watch = (el: Element | null, set: (visible: boolean) => void, invert = false) => {
      if (!el) return undefined
      const observer = new IntersectionObserver(([entry]) =>
        set(invert ? !entry.isIntersecting : entry.isIntersecting),
      )
      observer.observe(el)
      return observer
    }
    const footer = document.querySelector('.foot')
    const observers = [
      watch(intro, setPastIntro, true),
      watch(contact, setInContact),
      watch(footer, setInFooter),
    ]
    return () => observers.forEach((observer) => observer?.disconnect())
  }, [])

  const visible = pastIntro && !inContact && !inFooter

  return (
    <a
      className={visible ? 'wa-float on' : 'wa-float'}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Conversar no WhatsApp"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M21 11.5a8.4 8.4 0 0 1-12.3 7.4L3 21l2.1-5.6A8.4 8.4 0 1 1 21 11.5z" />
        <path d="M9 8.8c.3 2.8 2.6 5.1 5.4 5.4l1.2-1.3-1.9-1-.9.7c-.9-.4-1.7-1.2-2.1-2.1l.7-.9-1-1.9L9 8.8z" />
      </svg>
    </a>
  )
}
