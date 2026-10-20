import { describe, expect, it } from 'vitest'

import { dayKey, formatPercent, formatRatio, lastDays, ratio, shortDay } from '@/lib/dashboard'

describe('lastDays', () => {
  it('devolve os dias em ordem, com 0 onde não houve visita', () => {
    const now = new Date('2026-10-20T15:00:00Z')
    const days = lastDays(new Map([['2026-10-19', 4]]), 3, now)
    expect(days).toEqual([
      { day: '2026-10-18', value: 0 },
      { day: '2026-10-19', value: 4 },
      { day: '2026-10-20', value: 0 },
    ])
  })
})

describe('dayKey', () => {
  it('usa o horário de Brasília: 01h UTC ainda é o dia anterior', () => {
    expect(dayKey(new Date('2026-10-20T01:00:00Z'))).toBe('2026-10-19')
  })
})

describe('ratio', () => {
  it('não divide por zero', () => {
    expect(ratio(3, 0)).toBeNull()
    expect(ratio(3, 2)).toBe(1.5)
    expect(formatRatio(null)).toBe('–')
    expect(formatPercent(0.125)).toBe('12,5%')
  })
})

describe('shortDay', () => {
  it('troca para dia/mês', () => expect(shortDay('2026-10-20')).toBe('20/10'))
})
