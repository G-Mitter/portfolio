/** Lugar de uma visita, vindo dos cabeçalhos que a Vercel manda (só existem lá, não no seu computador). */
export type Place = { country: string; city: string; lat: number | null; lon: number | null }

type Raw = { country?: string | null; city?: string | null; lat?: string | null; lon?: string | null }

/** Número dentro do limite, com 1 casa decimal (cerca de 11 km: nível de cidade, nunca a rua). */
function coord(value: string | null | undefined, limit: number): number | null {
  const n = Number(value)
  return value && Number.isFinite(n) && Math.abs(n) <= limit ? Math.round(n * 10) / 10 : null
}

/**
 * Valida os cabeçalhos antes de gravar. Sem um país de 2 letras maiúsculas, devolve null
 * (visita sem lugar conhecido não entra na conta). A cidade vem codificada ("S%C3%A3o%20Paulo").
 */
export function parsePlace(raw: Raw): Place | null {
  const country = String(raw.country ?? '')
  if (!/^[A-Z]{2}$/.test(country)) return null
  let city = ''
  try {
    city = decodeURIComponent(String(raw.city ?? ''))
  } catch {
    // Texto mal codificado: fica sem cidade.
  }
  city = city.replace(/[^\p{L}\p{N} .'-]/gu, '').trim().slice(0, 60)
  return { country, city, lat: coord(raw.lat, 90), lon: coord(raw.lon, 180) }
}

/** "BR" vira "Brasil". Códigos que não são país (XX, T1) viram "Desconhecido". */
export function countryName(code: string): string {
  try {
    const name = new Intl.DisplayNames(['pt-BR'], { type: 'region' }).of(code)
    return name && name !== code ? name : 'Desconhecido'
  } catch {
    return 'Desconhecido'
  }
}

export type PlaceRow = { country: string; city: string; lat: number | null; lon: number | null; visits: number }

/** Soma linhas repetidas (um registro por dia) em uma por cidade. */
export function sumByCity(rows: PlaceRow[]): PlaceRow[] {
  const map = new Map<string, PlaceRow>()
  for (const row of rows) {
    const key = `${row.country}|${row.city}`
    const cur = map.get(key)
    if (cur) cur.visits += row.visits
    else map.set(key, { ...row })
  }
  return [...map.values()].sort((a, b) => b.visits - a.visits)
}

/** Ranking de países: os `top` primeiros e o resto somado em "Outros". */
export function topCountries(rows: PlaceRow[], top = 8): { label: string; visits: number }[] {
  const map = new Map<string, number>()
  for (const row of rows) map.set(row.country, (map.get(row.country) ?? 0) + row.visits)
  const sorted = [...map.entries()].sort((a, b) => b[1] - a[1])
  const list = sorted.slice(0, top).map(([code, visits]) => ({ label: countryName(code), visits }))
  const rest = sorted.slice(top).reduce((sum, [, visits]) => sum + visits, 0)
  return rest ? [...list, { label: 'Outros', visits: rest }] : list
}
