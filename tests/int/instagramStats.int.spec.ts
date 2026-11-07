import { describe, expect, it } from 'vitest'

import { insightMetrics, isRecent, matchEvent, matchMedia, needsRefresh, parseInsights, summarize, toTipo } from '@/lib/instagramStats'
import { parsePosts } from '@/lib/marketing'

const ICS = [
  'BEGIN:VCALENDAR',
  'BEGIN:VEVENT',
  'DTSTART:20261103T110000Z',
  'SUMMARY:[Post] Instagram · Reels · Robô de carga',
  'DESCRIPTION:rede: instagram\\nformato: reels\\ncampanha: Robo-Carga-Nov',
  'END:VEVENT',
  'BEGIN:VEVENT',
  'DTSTART:20261103T130000Z',
  'SUMMARY:[Post] Instagram · Story · Bastidores',
  'END:VEVENT',
  'BEGIN:VEVENT',
  'DTSTART:20261106T110000Z',
  'SUMMARY:[Post] Instagram · Carrossel · Antes e depois',
  'DESCRIPTION:campanha: outra',
  'END:VEVENT',
  'END:VCALENDAR',
].join('\r\n')
const events = parsePosts(ICS)

describe('toTipo', () => {
  it('separa reels, story, carrossel, foto e vídeo', () => {
    expect(toTipo({ media_type: 'VIDEO', media_product_type: 'REELS' })).toBe('reels')
    expect(toTipo({ media_type: 'IMAGE', media_product_type: 'STORY' })).toBe('story')
    expect(toTipo({ media_type: 'CAROUSEL_ALBUM', media_product_type: 'FEED' })).toBe('carrossel')
    expect(toTipo({ media_type: 'IMAGE', media_product_type: 'FEED' })).toBe('foto')
    expect(toTipo({ media_type: 'VIDEO', media_product_type: 'FEED' })).toBe('video')
  })

  it('story não pede salvamentos (a API recusaria)', () => {
    expect(insightMetrics('story')).not.toContain('saved')
    expect(insightMetrics('reels')).toContain('saved')
  })
})

describe('parseInsights', () => {
  it('lê values e total_value, e pega curtidas/comentários do post', () => {
    const body = { data: [{ name: 'reach', values: [{ value: 120 }] }, { name: 'saved', total_value: { value: 7 } }, { name: 'desconhecida', values: [{ value: 9 }] }] }
    expect(parseInsights(body, { like_count: 15, comments_count: 3 })).toMatchObject({ alcance: 120, salvamentos: 7, curtidas: 15, comentarios: 3, visualizacoes: 0 })
  })

  it('resposta vazia vira zeros', () => {
    expect(parseInsights(undefined, {}).alcance).toBe(0)
  })
})

describe('matchEvent / matchMedia', () => {
  it('liga pelo dia de Brasília e pelo formato, e lê a campanha em minúsculas', () => {
    expect(matchEvent({ tipo: 'reels', publicadoEm: '2026-11-03T11:02:00Z' }, events)?.campanha).toBe('robo-carga-nov')
    expect(matchEvent({ tipo: 'story', publicadoEm: '2026-11-03T13:30:00Z' }, events)?.title).toBe('Bastidores')
  })

  it('um único post no dia vale mesmo com formato diferente; dia sem evento não liga', () => {
    expect(matchEvent({ tipo: 'foto', publicadoEm: '2026-11-06T12:00:00Z' }, events)?.campanha).toBe('outra')
    expect(matchEvent({ tipo: 'reels', publicadoEm: '2026-11-04T12:00:00Z' }, events)).toBeUndefined()
    // 2 posts no dia e formato que não bate: não chuta
    expect(matchEvent({ tipo: 'foto', publicadoEm: '2026-11-03T12:00:00Z' }, events)).toBeUndefined()
  })

  it('do evento para o post publicado', () => {
    const media = [
      { id: 1, tipo: 'story' as const, publicadoEm: '2026-11-03T13:30:00Z' },
      { id: 2, tipo: 'reels' as const, publicadoEm: '2026-11-03T11:02:00Z' },
    ]
    expect(matchMedia(events[0], media, events)?.id).toBe(2)
    expect(matchMedia(events[1], media, events)?.id).toBe(1)
    expect(matchMedia(events[2], media, events)).toBeUndefined()
  })
})

describe('summarize', () => {
  it('soma por grupo, do maior alcance para o menor', () => {
    const rows = summarize(
      [
        { g: 'a', alcance: 10, curtidas: 1 },
        { g: 'b', alcance: 50, curtidas: null },
        { g: 'a', alcance: 30, curtidas: 2 },
      ],
      (x) => x.g,
    )
    expect(rows.map(([k, r]) => [k, r.posts, r.alcance, r.curtidas])).toEqual([
      ['b', 1, 50, 0],
      ['a', 2, 40, 3],
    ])
  })
})

describe('prazos', () => {
  const now = new Date('2026-11-30T12:00:00Z')
  it('atualiza só os últimos 30 dias', () => {
    expect(isRecent('2026-11-01T12:00:00Z', now)).toBe(true)
    expect(isRecent('2026-10-30T11:00:00Z', now)).toBe(false)
    expect(isRecent(undefined, now)).toBe(false)
  })
  it('renova o token sem data ou com mais de 7 dias', () => {
    expect(needsRefresh(null, now)).toBe(true)
    expect(needsRefresh('2026-11-20T12:00:00Z', now)).toBe(true)
    expect(needsRefresh('2026-11-28T12:00:00Z', now)).toBe(false)
  })
})
