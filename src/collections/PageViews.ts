import type { CollectionConfig } from 'payload'

/**
 * Visualizações de cada página do site: uma linha por endereço ("/" ou "/projetos/x"),
 * com o total de visualizações e de visitantes diferentes.
 * Quem soma é a Server Action `countView`; aqui é só para você ler no /admin.
 */
export const PageViews: CollectionConfig = {
  slug: 'page-views',
  labels: { singular: 'Visualização', plural: 'Visualizações' },
  admin: {
    useAsTitle: 'path',
    defaultColumns: ['path', 'views', 'visitors', 'updatedAt'],
    description:
      'Quantas vezes cada página foi vista ("/" é a página inicial). Visitas suas, logado no /admin, não contam.',
  },
  defaultSort: '-views',
  access: {
    create: () => false,
    read: ({ req }) => Boolean(req.user),
    update: () => false,
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'path', label: 'Página', type: 'text', required: true, unique: true },
    { name: 'views', label: 'Visualizações', type: 'number', defaultValue: 0 },
    { name: 'visitors', label: 'Visitantes', type: 'number', defaultValue: 0 },
  ],
}
