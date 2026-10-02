import { describe, expect, it } from 'vitest'

import { initials } from '@/lib/initials'

// Teste de unidade: as letras que aparecem no lugar da foto (perfil e recomendações).
describe('initials', () => {
  it('pega a primeira letra dos dois primeiros nomes', () => {
    expect(initials('Guilherme Mitter')).toBe('GM')
    expect(initials('ana maria souza')).toBe('AM')
  })

  it('aguenta espaços sobrando e nome único', () => {
    expect(initials('  Ana   Souza ')).toBe('AS')
    expect(initials('Ana')).toBe('A')
  })
})
