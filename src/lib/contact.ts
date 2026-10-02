/**
 * Regras do formulário de contato, separadas da página para poderem ser testadas.
 *
 * O navegador já confere os campos (required, minLength...), mas isso é só
 * conforto para o visitante: qualquer um pode enviar dados direto ao servidor
 * sem passar pela página. Por isso o servidor confere tudo de novo aqui.
 */

export type ContactInput = {
  name: string
  contact: string
  problem: string
}

export type ContactErrors = Partial<Record<keyof ContactInput, string>>

export type ContactResult = { ok: true; data: ContactInput } | { ok: false; errors: ContactErrors }

export const CONTACT_LIMITS = {
  name: { min: 2, max: 80 },
  contact: { max: 120 },
  problem: { min: 10, max: 2000 },
}

export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** O contato vale se for um e-mail ou um telefone com DDD (10 a 13 dígitos). */
export function isValidContact(value: string): boolean {
  if (EMAIL.test(value)) return true
  const digits = value.replace(/\D/g, '')
  return digits.length >= 10 && digits.length <= 13 && !/[a-z]/i.test(value)
}

/**
 * Limpa os espaços das pontas e confere cada campo.
 * Devolve os dados prontos ou um erro por campo, com a mensagem que aparece na tela.
 */
export function validateContact(raw: Record<string, unknown>): ContactResult {
  const text = (key: string) => (typeof raw[key] === 'string' ? (raw[key] as string).trim() : '')
  const data: ContactInput = {
    name: text('name'),
    contact: text('contact'),
    problem: text('problem'),
  }
  const errors: ContactErrors = {}

  if (data.name.length < CONTACT_LIMITS.name.min || data.name.length > CONTACT_LIMITS.name.max) {
    errors.name = 'Diga seu nome.'
  }
  if (data.contact.length > CONTACT_LIMITS.contact.max || !isValidContact(data.contact)) {
    errors.contact = 'Informe um e-mail ou um telefone com DDD.'
  }
  if (data.problem.length < CONTACT_LIMITS.problem.min) {
    errors.problem = 'Conte um pouco mais sobre o que você precisa.'
  } else if (data.problem.length > CONTACT_LIMITS.problem.max) {
    errors.problem = `Use até ${CONTACT_LIMITS.problem.max} caracteres.`
  }

  return Object.keys(errors).length > 0 ? { ok: false, errors } : { ok: true, data }
}
