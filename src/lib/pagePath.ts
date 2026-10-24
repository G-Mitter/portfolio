/**
 * Só estas páginas são contadas: a inicial, o portfólio e as de projeto.
 * Devolve o slug do projeto (ou "" nas outras) ou null se o endereço não vale.
 * Assim ninguém cria linhas no banco com endereços inventados.
 */
export function matchPage(path: unknown): { slug: string } | null {
  const match = /^\/(?:portfolio|projetos\/([a-z0-9-]{1,100}))?$/.exec(String(path))
  return match ? { slug: match[1] ?? '' } : null
}
