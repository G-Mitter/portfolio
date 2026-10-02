/**
 * Confere se um link digitado no /admin é um endereço web de verdade (http ou https).
 * Recusa coisas como "javascript:alert(1)", que num botão do site rodaria código
 * no navegador do visitante, e textos que não são links.
 */
export function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

/** Validação pronta para campos de link do Payload: vazio pode, link inválido não. */
export const validateHttpUrl = (value: string | null | undefined) =>
  !value || isHttpUrl(value) || 'Digite um link completo, começando com https://'
