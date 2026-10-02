import { describe, expect, it } from 'vitest'

import { splitItems } from '@/lib/skills'

// Teste de unidade: o texto do /admin vira a lista de etiquetas do site.
describe('splitItems', () => {
  it('separa por vírgula e tira os espaços', () => {
    expect(splitItems('JavaScript, TypeScript , Python')).toEqual([
      'JavaScript',
      'TypeScript',
      'Python',
    ])
  })

  it('ignora vírgulas sobrando', () => {
    expect(splitItems('Git,, GitHub,')).toEqual(['Git', 'GitHub'])
  })
})
