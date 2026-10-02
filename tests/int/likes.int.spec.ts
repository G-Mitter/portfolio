import { describe, expect, it } from 'vitest'

import { isVisitorId, likesLabel, newVisitorId } from '@/lib/likes'

// Teste de unidade: o texto do contador e o formato do código do visitante.
describe('likesLabel', () => {
  it('usa singular e plural', () => {
    expect(likesLabel(0)).toBe('0 curtidas')
    expect(likesLabel(1)).toBe('1 curtida')
    expect(likesLabel(1200)).toBe('1.200 curtidas')
  })
})

describe('isVisitorId', () => {
  it('aceita só o código que o próprio site cria', () => {
    expect(isVisitorId(newVisitorId())).toBe(true)
    expect(isVisitorId(undefined)).toBe(false)
    expect(isVisitorId("' or 1=1 --")).toBe(false)
  })
})
