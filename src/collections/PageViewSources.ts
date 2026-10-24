import type { CollectionConfig } from 'payload'

import { SOURCES } from '@/lib/source'

/**
 * Visitas por origem e por dia (LinkedIn, Google, direto...). Conta uma vez por visita
 * (a primeira página que a pessoa abre na aba), não a cada página, e só guarda a contagem:
 * nada de IP nem de endereço completo. Quem soma é `addSource` (src/lib/views.ts).
 * Alimenta o gráfico de origem do /dashboard.
 */
export const PageViewSources: CollectionConfig = {
  slug: 'page-view-sources',
  labels: { singular: 'Visitas por origem', plural: 'Visitas por origem' },
  admin: { hidden: true, useAsTitle: 'source' },
  defaultSort: '-day',
  indexes: [{ fields: ['day', 'source'], unique: true }],
  access: {
    create: () => false,
    read: ({ req }) => Boolean(req.user),
    update: () => false,
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'day', type: 'text', required: true, index: true },
    { name: 'source', type: 'select', required: true, options: [...SOURCES] },
    { name: 'visits', type: 'number', defaultValue: 0 },
  ],
}
