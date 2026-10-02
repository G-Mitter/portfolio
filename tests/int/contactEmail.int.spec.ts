import { describe, expect, it } from 'vitest'

import { buildContactEmail, escapeHtml } from '@/lib/contactEmail'

// Teste de unidade: o e-mail de aviso que chega quando alguém usa o formulário.
describe('buildContactEmail', () => {
  const base = { id: 7, name: 'Maria', contact: 'maria@empresa.com', problem: 'Planilhas.' }

  it('usa o e-mail da pessoa como "Responder para"', () => {
    const email = buildContactEmail(base, 'https://site.com')
    expect(email.replyTo).toBe('maria@empresa.com')
    expect(email.subject).toBe('Nova mensagem no portfólio: Maria')
    expect(email.text).toContain('https://site.com/admin/collections/messages/7')
  })

  it('não define "Responder para" quando o contato é telefone', () => {
    const email = buildContactEmail({ ...base, contact: '(31) 99999-0000' }, 'https://site.com')
    expect(email.replyTo).toBeUndefined()
    expect(email.text).toContain('Telefone: (31) 99999-0000')
  })

  it('escapa o HTML que o visitante escreveu', () => {
    const email = buildContactEmail(
      { ...base, problem: '<a href="x">clique</a>' },
      'https://site.com',
    )
    expect(email.html).not.toContain('<a href="x">')
    expect(escapeHtml('<b>"oi" & \'tchau\'</b>')).toBe(
      '&lt;b&gt;&quot;oi&quot; &amp; &#39;tchau&#39;&lt;/b&gt;',
    )
  })
})
