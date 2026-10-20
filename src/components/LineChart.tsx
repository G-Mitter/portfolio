import { shortDay, type DayPoint } from '@/lib/dashboard'

const W = 600
const H = 160
const PAD = { top: 12, right: 8, bottom: 24, left: 32 }

/** Gráfico de linha em SVG puro: um ponto por dia. Sem biblioteca, para o site continuar leve. */
export function LineChart({ data, label }: { data: DayPoint[]; label: string }) {
  // O topo do eixo é o maior valor (mínimo 1, para o eixo não ficar achatado quando tudo é 0).
  const max = Math.max(1, ...data.map((d) => d.value))
  const x = (i: number) => PAD.left + (i * (W - PAD.left - PAD.right)) / Math.max(1, data.length - 1)
  const y = (v: number) => PAD.top + (1 - v / max) * (H - PAD.top - PAD.bottom)
  const points = data.map((d, i) => `${x(i)},${y(d.value)}`).join(' ')
  const total = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img" aria-label={`${label}: ${total} no período`}>
      <line className="chart-grid" x1={PAD.left} x2={W - PAD.right} y1={y(0)} y2={y(0)} />
      <line className="chart-grid" x1={PAD.left} x2={W - PAD.right} y1={y(max)} y2={y(max)} />
      <text className="chart-text" x={PAD.left - 6} y={y(max) + 4} textAnchor="end">{max}</text>
      <text className="chart-text" x={PAD.left - 6} y={y(0) + 4} textAnchor="end">0</text>
      <polyline className="chart-line" points={points} fill="none" />
      {data.map((d, i) => (
        <circle key={d.day} className="chart-dot" cx={x(i)} cy={y(d.value)} r={3}>
          <title>{`${shortDay(d.day)}: ${d.value}`}</title>
        </circle>
      ))}
      <text className="chart-text" x={PAD.left} y={H - 6}>{shortDay(data[0].day)}</text>
      <text className="chart-text" x={W - PAD.right} y={H - 6} textAnchor="end">{shortDay(data[data.length - 1].day)}</text>
    </svg>
  )
}
