/** De onde veio a visita. A lista é fixa: o servidor só grava um destes nomes, nunca texto vindo do navegador. */
export const SOURCES = ['linkedin', 'google', 'instagram', 'whatsapp', 'direto', 'outros'] as const
export type Source = (typeof SOURCES)[number]

export const SOURCE_LABELS: Record<Source, string> = {
  linkedin: 'LinkedIn',
  google: 'Google',
  instagram: 'Instagram',
  whatsapp: 'WhatsApp',
  direto: 'Direto',
  outros: 'Outros',
}

/** Sites conhecidos, pelo endereço de quem mandou a pessoa (o "referrer"). */
const HOSTS: [RegExp, Source][] = [
  [/(^|\.)linkedin\.com$|^lnkd\.in$/, 'linkedin'],
  [/(^|\.)google\.[a-z]{2,3}(\.[a-z]{2})?$/, 'google'],
  [/(^|\.)instagram\.com$/, 'instagram'],
  [/(^|\.)whatsapp\.com$|^wa\.me$/, 'whatsapp'],
]

/**
 * Descobre a origem. Primeiro a etiqueta do link (`?utm_source=linkedin`), que é a mais
 * confiável; depois o endereço de onde a pessoa veio. Sem nenhum dos dois: "direto"
 * (digitou o endereço, abriu pelo app ou o navegador escondeu a origem).
 */
export function classifySource(utm?: string, referrerHost?: string): Source {
  const tag = String(utm ?? '').trim().toLowerCase()
  if (tag) return (SOURCES as readonly string[]).includes(tag) ? (tag as Source) : 'outros'

  const host = String(referrerHost ?? '').trim().toLowerCase()
  if (!host || !/^[a-z0-9.-]{1,100}$/.test(host)) return 'direto'
  return HOSTS.find(([pattern]) => pattern.test(host))?.[1] ?? 'outros'
}
