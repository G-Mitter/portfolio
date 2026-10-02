import { describe, expect, it } from 'vitest'

import { isHttpUrl, validateHttpUrl } from '@/lib/httpUrl'

// Teste de unidade: só links http(s) viram botão no site.
describe('isHttpUrl', () => {
  it('aceita links http e https', () => {
    expect(isHttpUrl('https://github.com/G-Mitter')).toBe(true)
    expect(isHttpUrl('http://exemplo.com')).toBe(true)
  })

  it('recusa javascript:, mailto: e texto solto', () => {
    expect(isHttpUrl('javascript:alert(1)')).toBe(false)
    expect(isHttpUrl('mailto:a@b.com')).toBe(false)
    expect(isHttpUrl('github.com/G-Mitter')).toBe(false)
  })
})

describe('validateHttpUrl', () => {
  it('deixa o campo vazio e devolve a mensagem para link inválido', () => {
    expect(validateHttpUrl('')).toBe(true)
    expect(validateHttpUrl(null)).toBe(true)
    expect(validateHttpUrl('javascript:alert(1)')).toMatch(/https:\/\//)
  })
})
