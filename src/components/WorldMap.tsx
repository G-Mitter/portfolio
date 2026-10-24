import { WORLD_PATH } from '@/lib/worldPath'
import type { PlaceRow } from '@/lib/place'

/**
 * Mapa plano com uma bolha por cidade; quanto mais visitas, maior a bolha.
 * `box` é o pedaço do mundo mostrado ("x y largura altura", em graus): o mundo todo ou só o Brasil.
 * A área (não o raio) é proporcional às visitas, por isso a raiz quadrada: assim 4x mais visitas parece 4x maior.
 */
export function WorldMap({ places, box, label, maxRadius }: { places: PlaceRow[]; box: string; label: string; maxRadius: number }) {
  const located = places.filter((p) => p.lat !== null && p.lon !== null)
  const max = Math.max(1, ...located.map((p) => p.visits))

  return (
    <svg viewBox={box} className="map" role="img" aria-label={label}>
      <path d={WORLD_PATH} className="map-land" vectorEffect="non-scaling-stroke" />
      {located.map((p) => (
        <circle
          key={`${p.country}|${p.city}`}
          className="map-dot"
          cx={(p.lon as number) + 180}
          cy={90 - (p.lat as number)}
          r={0.4 + Math.sqrt(p.visits / max) * maxRadius}
        >
          <title>{`${p.city || p.country}: ${p.visits}`}</title>
        </circle>
      ))}
    </svg>
  )
}
