import { describe, expect, it } from 'vitest'

import { instagramUrl } from '@/lib/instagram'

// Teste de unidade: qualquer jeito de digitar o perfil gera o mesmo link.
describe('instagramUrl', () => {
  const expected = 'https://www.instagram.com/gui.mitter/'

  it('aceita @usuario, usuario ou o link completo', () => {
    expect(instagramUrl('@gui.mitter')).toBe(expected)
    expect(instagramUrl('gui.mitter')).toBe(expected)
    expect(instagramUrl('instagram.com/gui.mitter')).toBe(expected)
    expect(instagramUrl('https://www.instagram.com/gui.mitter/?hl=pt')).toBe(expected)
  })

  it('devolve null para vazio ou texto inválido', () => {
    expect(instagramUrl('')).toBeNull()
    expect(instagramUrl(null)).toBeNull()
    expect(instagramUrl('nome com espaço')).toBeNull()
  })
})
