import type { CollectionConfig } from 'payload'

/**
 * Curtidas dos posts. Cada curtida é um registro: qual projeto e qual visitante.
 *
 * Por que uma coleção separada, e não um número dentro do projeto?
 * Os projetos têm rascunhos e histórico de versões: somar 1 no projeto a cada
 * curtida criaria uma versão nova toda vez. Aqui cada curtida é uma linha,
 * e o total é só uma contagem.
 *
 * O "visitante" é um código aleatório guardado num cookie do navegador.
 * Ele não diz quem é a pessoa; só impede que o mesmo navegador curta duas vezes.
 */
export const Likes: CollectionConfig = {
  slug: 'likes',
  labels: { singular: 'Curtida', plural: 'Curtidas' },
  admin: {
    defaultColumns: ['project', 'createdAt'],
    description: 'Curtidas dos posts. São criadas pelo coração na página de cada projeto.',
  },
  defaultSort: '-createdAt',
  // O banco recusa a mesma dupla projeto + visitante duas vezes,
  // mesmo se dois cliques chegarem ao mesmo tempo.
  indexes: [{ fields: ['project', 'visitor'], unique: true }],
  access: {
    // Como nas mensagens: ninguém cria nem apaga pela API pública.
    // Só a Server Action do site, que roda no servidor.
    create: () => false,
    read: ({ req }) => Boolean(req.user),
    update: () => false,
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'project',
      label: 'Projeto',
      type: 'relationship',
      relationTo: 'projects',
      required: true,
      index: true,
    },
    {
      name: 'visitor',
      label: 'Visitante (código anônimo)',
      type: 'text',
      required: true,
      index: true,
      admin: { readOnly: true },
    },
  ],
}
