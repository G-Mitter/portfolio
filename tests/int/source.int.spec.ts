import { describe, expect, it } from 'vitest'

import { classifySource } from '@/lib/source'

describe('classifySource', () => {
  it('a etiqueta do link vale mais que o referrer', () => {
    expect(classifySource('LinkedIn', 'google.com')).toBe('linkedin')
    expect(classifySource('newsletter', 'google.com')).toBe('outros')
  })

  it('reconhece sites pelo endereço de origem', () => {
    expect(classifySource(undefined, 'www.linkedin.com')).toBe('linkedin')
    expect(classifySource(undefined, 'lnkd.in')).toBe('linkedin')
    expect(classifySource(undefined, 'www.google.com.br')).toBe('google')
    expect(classifySource(undefined, 'l.instagram.com')).toBe('instagram')
    expect(classifySource(undefined, 'wa.me')).toBe('whatsapp')
    expect(classifySource(undefined, 'exemplo.org')).toBe('outros')
  })

  it('sem origem, ou com texto estranho, é direto', () => {
    expect(classifySource()).toBe('direto')
    expect(classifySource('', '')).toBe('direto')
    expect(classifySource(undefined, "x'; drop table")).toBe('direto')
    expect(classifySource(undefined, 'notgoogle.com')).toBe('outros')
  })
})
