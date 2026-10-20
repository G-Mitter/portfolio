/** Cálculos do /dashboard: funções puras (só recebem números e devolvem números), fáceis de testar. */

export type DayPoint = { day: string; value: number }

/** "2026-10-20" no horário de Brasília (mesmo critério que `addView` usa ao gravar). */
export function dayKey(date: Date): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(date)
}

/** O dia de `n` dias atrás ("2026-10-18"). `now` existe para o teste fixar a data. */
export function daysAgo(n: number, now = new Date()): string {
  return dayKey(new Date(now.getTime() - n * 24 * 60 * 60 * 1000))
}

/**
 * Os últimos `count` dias, do mais antigo ao de hoje, com 0 nos dias sem visita.
 * Sem isso o gráfico "pularia" os dias vazios e mentiria sobre o ritmo.
 */
export function lastDays(totals: Map<string, number>, count: number, now = new Date()): DayPoint[] {
  const days: DayPoint[] = []
  for (let i = count - 1; i >= 0; i--) {
    const day = daysAgo(i, now)
    days.push({ day, value: totals.get(day) ?? 0 })
  }
  return days
}

/** Divisão que devolve null em vez de NaN/infinito quando o divisor é 0 ("sem dados" ≠ zero). */
export function ratio(part: number, whole: number): number | null {
  return whole > 0 ? part / whole : null
}

/** "2,5" ou "–" quando não há dado. */
export function formatRatio(value: number | null): string {
  return value === null ? '–' : value.toLocaleString('pt-BR', { maximumFractionDigits: 2 })
}

/** "12,5%" ou "–". */
export function formatPercent(value: number | null): string {
  return value === null ? '–' : `${(value * 100).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`
}

/** "2026-10-20" vira "20/10". */
export function shortDay(day: string): string {
  const [, month, date] = day.split('-')
  return `${date}/${month}`
}
