import { describe, expect, it } from 'vitest'

import { matchPage } from '@/lib/pagePath'
import { bucketFor, formatDuration, parseSeconds } from '@/lib/timing'

describe('parseSeconds', () => {
  it('aceita só inteiros de 1 a 600', () => {
    expect(parseSeconds(45)).toBe(45)
    expect(parseSeconds(600)).toBe(600)
    expect(parseSeconds(0)).toBeNull()
    expect(parseSeconds(601)).toBeNull()
    expect(parseSeconds(1.5)).toBeNull()
    expect(parseSeconds('30')).toBeNull()
  })
})

describe('bucketFor', () => {
  it('escolhe a faixa nos limites', () => {
    expect([1, 9, 10, 29, 30, 59, 60, 179, 180, 600].map(bucketFor)).toEqual([
      'ate10', 'ate10', 'ate30', 'ate30', 'ate60', 'ate60', 'ate180', 'ate180', 'mais180', 'mais180',
    ])
  })
})

describe('formatDuration', () => {
  it('escreve em segundos e minutos', () => {
    expect(formatDuration(null)).toBe('–')
    expect(formatDuration(45)).toBe('45 s')
    expect(formatDuration(72)).toBe('1 min 12 s')
  })
})

describe('matchPage', () => {
  it('aceita só as páginas do site', () => {
    expect(matchPage('/')).toEqual({ slug: '' })
    expect(matchPage('/portfolio')).toEqual({ slug: '' })
    expect(matchPage('/projetos/supply-flow')).toEqual({ slug: 'supply-flow' })
    expect(matchPage('/admin')).toBeNull()
    expect(matchPage('/projetos/../x')).toBeNull()
  })
})
