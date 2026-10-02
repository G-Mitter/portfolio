import { EMAIL, isValidContact } from './contact'

type NewMessage = {
  id: number
  name: string
  contact: string
  problem: string
  source?: string | null
}

/**
 * Troca os caracteres especiais do HTML (<, >, &, aspas) por códigos seguros.
 * O texto vem de um visitante: sem isso, alguém poderia escrever HTML no
 * formulário e montar links ou imagens falsas dentro do seu e-mail.
 */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * Monta o e-mail de aviso de uma mensagem nova.
 * Se a pessoa deixou um e-mail, ele vira o "Responder para":
 * no Gmail, clicar em Responder já escreve para ela.
 */
export function buildContactEmail(message: NewMessage, siteUrl: string) {
  const adminUrl = `${siteUrl}/admin/collections/messages/${message.id}`
  const replyTo = EMAIL.test(message.contact) ? message.contact : undefined
  const contactKind = replyTo ? 'E-mail' : isValidContact(message.contact) ? 'Telefone' : 'Contato'
  const origin = message.source ? `Veio do projeto: ${message.source}` : 'Veio da página inicial'

  const text = [
    `${message.name} mandou uma mensagem pelo portfólio.`,
    '',
    `${contactKind}: ${message.contact}`,
    origin,
    '',
    message.problem,
    '',
    `Ver no /admin: ${adminUrl}`,
  ].join('\n')

  const html = `
    <p><strong>${escapeHtml(message.name)}</strong> mandou uma mensagem pelo portfólio.</p>
    <p>${contactKind}: <strong>${escapeHtml(message.contact)}</strong><br>${escapeHtml(origin)}</p>
    <blockquote style="margin:0;padding:8px 12px;border-left:3px solid #2f5fd6;white-space:pre-wrap">${escapeHtml(message.problem)}</blockquote>
    <p><a href="${escapeHtml(adminUrl)}">Ver no /admin</a></p>`

  return {
    subject: `Nova mensagem no portfólio: ${message.name}`,
    text,
    html,
    replyTo,
  }
}
