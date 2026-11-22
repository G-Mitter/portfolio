import type { GlobalConfig } from 'payload'

/**
 * Guarda o resultado da última atualização do Instagram (quando rodou e o último erro).
 * O token vem da variável INSTAGRAM_TOKEN da Vercel (token de usuário do sistema, que não expira); ele nunca fica no banco.
 */
export const InstagramConnection: GlobalConfig = {
  slug: 'instagram-conexao',
  label: 'Conexão com o Instagram',
  admin: { hidden: true },
  access: { read: () => false, update: () => false },
  fields: [
    { name: 'ultimaSincronizacao', type: 'date' },
    { name: 'ultimoErro', type: 'text' },
  ],
}
