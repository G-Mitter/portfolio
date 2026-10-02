/** Nome do cookie com o código anônimo do visitante. */
export const VISITOR_COOKIE = 'visitante'

/** Aceita só o formato que nós mesmos criamos (um UUID), para ninguém mandar texto qualquer. */
export function isVisitorId(value: string | undefined): value is string {
  return Boolean(value && /^[0-9a-f-]{36}$/.test(value))
}

/** "1 curtida", "12 curtidas" */
export function likesLabel(count: number): string {
  return `${count.toLocaleString('pt-BR')} ${count === 1 ? 'curtida' : 'curtidas'}`
}
