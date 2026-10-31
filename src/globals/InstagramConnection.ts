import type { GlobalConfig } from 'payload'

/**
 * Guarda o token do Instagram renovado pela rotina (ele vale 60 dias e a rotina renova toda semana)
 * e o resultado da última atualização. Só o servidor lê: nem o /admin nem a API mostram.
 * O primeiro token vem da variável INSTAGRAM_TOKEN da Vercel; trocar a variável faz o site usar o novo.
 */
export const InstagramConnection: GlobalConfig = {
  slug: 'instagram-conexao',
  label: 'Conexão com o Instagram',
  admin: { hidden: true },
  access: { read: () => false, update: () => false },
  fields: [
    { name: 'token', type: 'text' },
    { name: 'tokenDoEnv', type: 'text' }, // sha256 da INSTAGRAM_TOKEN que gerou o token acima
    { name: 'renovadoEm', type: 'date' },
    { name: 'ultimaSincronizacao', type: 'date' },
    { name: 'ultimoErro', type: 'text' },
  ],
}
