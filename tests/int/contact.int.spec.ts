import { describe, expect, it } from 'vitest'

import { isValidContact, validateContact } from '@/lib/contact'

// Teste de unidade: as regras que o servidor usa antes de salvar uma mensagem.
describe('validateContact', () => {
  const valid = {
    name: '  Maria  ',
    contact: 'maria@empresa.com',
    problem: 'Passamos horas copiando planilhas.',
  }

  it('aceita dados válidos e tira os espaços das pontas', () => {
    const result = validateContact(valid)
    expect(result).toEqual({ ok: true, data: { ...valid, name: 'Maria' } })
  })

  it('aceita e-mail ou telefone com DDD como contato', () => {
    expect(isValidContact('maria@empresa.com')).toBe(true)
    expect(isValidContact('(31) 99999-0000')).toBe(true)
    expect(isValidContact('+55 31 99999-0000')).toBe(true)
    expect(isValidContact('99999')).toBe(false)
    expect(isValidContact('maria')).toBe(false)
  })

  it('aponta o erro de cada campo', () => {
    const result = validateContact({ name: '', contact: 'abc', problem: 'curto' })
    expect(result.ok).toBe(false)
    if (!result.ok)
      expect(Object.keys(result.errors).sort()).toEqual(['contact', 'name', 'problem'])
  })

  it('ignora campos que não são texto', () => {
    expect(validateContact({ ...valid, name: 123 }).ok).toBe(false)
  })
})
