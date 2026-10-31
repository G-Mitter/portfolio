import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Usuário', plural: 'Usuários' },
  admin: {
    useAsTitle: 'email',
  },
  // Chave de API: deixa o Claude enviar os arquivos do marketing (/api/marketing-files) sem a sua senha.
  // Ligue em /admin > Usuários > você > "Ativar chave de API".
  auth: { useAPIKey: true },
  // O e-mail e a senha o Payload cria sozinho (auth: true).
  fields: [],
}
