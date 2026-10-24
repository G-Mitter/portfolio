/** Faixas de tempo na página. A lista é fixa: o servidor só grava uma destas faixas. */
export const BUCKETS = ['ate10', 'ate30', 'ate60', 'ate180', 'mais180'] as const
export type Bucket = (typeof BUCKETS)[number]

export const BUCKET_LABELS: Record<Bucket, string> = {
  ate10: 'Menos de 10 s',
  ate30: '10 a 30 s',
  ate60: '30 s a 1 min',
  ate180: '1 a 3 min',
  mais180: 'Mais de 3 min',
}

/** Teto de uma visita: abas esquecidas abertas não entram como horas de leitura. */
export const MAX_SECONDS = 600

/** Aceita só um número inteiro de segundos entre 1 e 600; o resto vira null. */
export function parseSeconds(value: unknown): number | null {
  const n = typeof value === 'number' ? value : NaN
  return Number.isInteger(n) && n >= 1 && n <= MAX_SECONDS ? n : null
}

export function bucketFor(seconds: number): Bucket {
  if (seconds < 10) return 'ate10'
  if (seconds < 30) return 'ate30'
  if (seconds < 60) return 'ate60'
  if (seconds < 180) return 'ate180'
  return 'mais180'
}

/** "45 s", "1 min 12 s" ou "–" quando não há dado. */
export function formatDuration(seconds: number | null): string {
  if (seconds === null) return '–'
  const s = Math.round(seconds)
  return s < 60 ? `${s} s` : `${Math.floor(s / 60)} min ${s % 60} s`
}
