import { describe, expect, it } from 'vitest'

import { countryName, parsePlace, sumByCity, topCountries } from '@/lib/place'

describe('parsePlace', () => {
  it('aceita os cabeçalhos da Vercel e arredonda as coordenadas', () => {
    expect(parsePlace({ country: 'BR', city: 'S%C3%A3o%20Paulo', lat: '-23.5505', lon: '-46.6333' })).toEqual({
      country: 'BR',
      city: 'São Paulo',
      lat: -23.6,
      lon: -46.6,
    })
  })

  it('recusa país inválido e limpa texto estranho', () => {
    expect(parsePlace({ country: 'br' })).toBeNull()
    expect(parsePlace({ country: 'BR', city: '%ZZ' })?.city).toBe('')
    expect(parsePlace({})).toBeNull()
    expect(parsePlace({ country: 'BR', city: '%3Cb%3ERio', lat: '999', lon: 'x' })).toEqual({
      country: 'BR',
      city: 'bRio',
      lat: null,
      lon: null,
    })
  })
})

describe('countryName', () => {
  it('traduz o código', () => {
    expect(countryName('BR')).toBe('Brasil')
    expect(countryName('XX')).toBe('Desconhecido')
  })
})

describe('sumByCity e topCountries', () => {
  const rows = [
    { country: 'BR', city: 'Belo Horizonte', lat: -19.9, lon: -43.9, visits: 3 },
    { country: 'BR', city: 'Belo Horizonte', lat: -19.9, lon: -43.9, visits: 2 },
    { country: 'US', city: 'Austin', lat: 30.3, lon: -97.7, visits: 4 },
    { country: 'PT', city: '', lat: null, lon: null, visits: 1 },
  ]
  it('soma os dias de cada cidade', () => {
    expect(sumByCity(rows).map((r) => [r.city, r.visits])).toEqual([['Belo Horizonte', 5], ['Austin', 4], ['', 1]])
  })
  it('agrupa o resto em Outros', () => {
    expect(topCountries(rows, 1)).toEqual([{ label: 'Brasil', visits: 5 }, { label: 'Outros', visits: 5 }])
  })
})
