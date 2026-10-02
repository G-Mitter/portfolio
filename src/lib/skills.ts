/**
 * Separa o texto digitado no /admin em uma lista de tecnologias.
 * "JavaScript, TypeScript , Python" -> ['JavaScript', 'TypeScript', 'Python']
 * Espaços sobrando e vírgulas repetidas são ignorados.
 */
export function splitItems(items: string): string[] {
  return items
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}
