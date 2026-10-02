/**
 * Endereço público do site, usado onde é preciso o link completo
 * (prévia ao compartilhar, link do /admin no e-mail de aviso...).
 * Ordem: NEXT_PUBLIC_SERVER_URL (domínio próprio, se um dia tiver) →
 * VERCEL_PROJECT_PRODUCTION_URL (criada pela Vercel) → localhost.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000')
