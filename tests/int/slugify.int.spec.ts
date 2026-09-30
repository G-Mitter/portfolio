import { describe, expect, it } from 'vitest'

import { slugify } from '@/lib/slugify'

// Teste de unidade: testa uma função isolada, sem banco nem navegador.
describe('slugify', () => {
  it('remove acentos e troca espaços por hífen', () => {
    expect(slugify('Automações RPA')).toBe('automacoes-rpa')
  })

  it('remove símbolos e hífens nas pontas', () => {
    expect(slugify('  Portal de TI (Knowledge Base)! ')).toBe('portal-de-ti-knowledge-base')
  })
})
