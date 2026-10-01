import type { Access } from 'payload'

/**
 * Regra de acesso de leitura dos projetos.
 *
 * - Se quem pede está logado no /admin (você), pode ver tudo, inclusive rascunhos.
 * - Se é um visitante, devolvemos um filtro ("where") em vez de true/false:
 *   o Payload aplica esse filtro na consulta ao banco, então rascunhos
 *   nunca saem do servidor para o navegador de um visitante.
 */
export const publishedOrLoggedIn: Access = ({ req: { user } }) => {
  if (user) return true

  return {
    _status: {
      equals: 'published',
    },
  }
}
