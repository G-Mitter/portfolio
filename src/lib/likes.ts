/** Nome do cookie com o código anônimo do visitante. */
export const VISITOR_COOKIE = 'visitante'

/** O cookie dura 1 ano: a curtida continua marcada quando a pessoa volta. */
export const VISITOR_MAX_AGE = 60 * 60 * 24 * 365

/** Teto de curtidas por hora no site todo, para um robô não encher o banco. */
export const MAX_LIKES_PER_HOUR = 300

/** Aceita só o formato que nós mesmos criamos (um UUID), para ninguém mandar texto qualquer. */
export function isVisitorId(value: string | undefined): value is string {
  return Boolean(value && /^[0-9a-f-]{36}$/.test(value))
}

export function newVisitorId(): string {
  // crypto.randomUUID existe no Node e no navegador, sem precisar importar nada.
  return crypto.randomUUID()
}

/** "1 curtida", "12 curtidas" */
export function likesLabel(count: number): string {
  return `${count.toLocaleString('pt-BR')} ${count === 1 ? 'curtida' : 'curtidas'}`
}
