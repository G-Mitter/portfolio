type Item = { id: number; link?: string | null; capaUrl?: string | null }

/** Faixa "Últimos posts do Instagram": capas já copiadas para o Blob pela sincronização, sem script de terceiros. */
export function InstagramStrip({ items, profileUrl }: { items: Item[]; profileUrl: string | null }) {
  if (items.length === 0) return null
  return (
    <section className="ig-strip band band-light" aria-labelledby="ig-titulo">
      <h2 id="ig-titulo">Últimos posts do Instagram</h2>
      <ul>
        {items.map((m) => (
          <li key={m.id}>
            <a href={m.link ?? profileUrl ?? '#'} target="_blank" rel="noopener noreferrer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.capaUrl!} alt="Capa de um post recente do Instagram" loading="lazy" />
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
          </li>
        ))}
      </ul>
      {profileUrl && (
        <a className="ig-follow" href={profileUrl} target="_blank" rel="noopener noreferrer">
          Seguir no Instagram ↗<span className="sr-only"> (abre em nova aba)</span>
        </a>
      )}
    </section>
  )
}
