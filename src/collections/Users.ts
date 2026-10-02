import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Usuário', plural: 'Usuários' },
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  // O e-mail e a senha o Payload cria sozinho (auth: true).
  fields: [],
}
