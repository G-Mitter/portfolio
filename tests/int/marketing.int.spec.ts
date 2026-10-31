import { describe, expect, it } from 'vitest'

import { deliveryFolder, expiredFolders, isExpired, monthGrid, parseMonth, parsePosts, shiftMonth, type Post } from '@/lib/marketing'

const ICS = [
  'BEGIN:VCALENDAR',
  'BEGIN:VEVENT',
  'DTSTART:20261103T110000Z',
  'SUMMARY:[Post] Instagram · Reels · Robô de carga dos caixas',
  'DESCRIPTION:rede: instagram\\nformato: reels\\narquivo: Marketing/Entregas/2026-10-31-reel-robo-carga/reel.mp4\\nlegenda: Marketing/En',
  ' tregas/2026-10-31-reel-robo-carga/legenda.md\\nstatus: agendado',
  'END:VEVENT',
  'BEGIN:VEVENT',
  'DTSTART;TZID=America/Sao_Paulo:20261102T080000',
  'SUMMARY:Dentista',
  'END:VEVENT',
  'BEGIN:VEVENT',
  'DTSTART;TZID=America/Sao_Paulo:20261101T080000',
  'SUMMARY:[Post] LinkedIn · Carrossel · Teste\\, com vírgula',
  'END:VEVENT',
  'END:VCALENDAR',
].join('\r\n')

describe('parsePosts', () => {
  const posts = parsePosts(ICS)

  it('pega só os eventos [Post], em ordem de data', () => {
    expect(posts.map((p) => p.title)).toEqual(['Teste, com vírgula', 'Robô de carga dos caixas'])
  })

  it('lê UTC no horário de Brasília e junta linhas dobradas da descrição', () => {
    const reel = posts[1]
    expect(reel.day).toBe('2026-11-03')
    expect(reel.time).toBe('08:00')
    expect(reel.legenda).toBe('Marketing/Entregas/2026-10-31-reel-robo-carga/legenda.md')
    expect(reel.status).toBe('agendado')
  })

  it('sem descrição, usa rede e formato do título', () => {
    expect(posts[0]).toMatchObject({ day: '2026-11-01', time: '08:00', rede: 'linkedin', formato: 'carrossel' })
  })
})

describe('mês', () => {
  it('aceita só AAAA-MM e navega entre anos', () => {
    expect(parseMonth('2026-13', new Date('2026-10-31T12:00:00Z'))).toBe('2026-10')
    expect(shiftMonth('2026-12', 1)).toBe('2027-01')
    expect(shiftMonth('2026-01', -1)).toBe('2025-12')
  })

  it('monta semanas de segunda a domingo', () => {
    const weeks = monthGrid('2026-11') // 01/11/2026 é domingo
    expect(weeks[0]).toEqual([null, null, null, null, null, null, '2026-11-01'])
    expect(weeks.at(-1)?.at(0)).toBe('2026-11-30')
  })
})

describe('deliveryFolder', () => {
  it('acha a pasta da entrega pelo arquivo ou pela legenda', () => {
    expect(deliveryFolder({ arquivo: 'Marketing/Entregas/2026-10-31-reel-robo-carga/reel.mp4', legenda: '' })).toBe('2026-10-31-reel-robo-carga')
    expect(deliveryFolder({ arquivo: '', legenda: 'Marketing\\Entregas\\2026-10-31-carrossel\\legenda.md' })).toBe('2026-10-31-carrossel')
  })
})

describe('limpeza depois de 5 dias', () => {
  const now = new Date('2026-11-08T12:00:00-03:00')
  const post = (day: string, pasta: string) => ({ day, arquivo: `Marketing/Entregas/${pasta}/x.png`, legenda: '' }) as Post

  it('o post sai no 5º dia depois da data', () => {
    expect(isExpired({ day: '2026-11-03' }, now)).toBe(true)
    expect(isExpired({ day: '2026-11-04' }, now)).toBe(false)
  })

  it('só apaga a pasta quando todos os posts dela passaram do prazo', () => {
    const posts = [post('2026-11-03', 'a'), post('2026-11-03', 'b'), post('2026-11-06', 'b'), post('2026-11-10', 'c')]
    expect(expiredFolders(posts, now)).toEqual(['a'])
  })
})
