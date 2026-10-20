import type { CollectionConfig } from 'payload'

/**
 * Visualizações por dia: uma linha por página e por dia.
 * A coleção "Visualizações" guarda só o total; sem a data não dá para
 * desenhar "como as visitas evoluem". É daqui que sai o gráfico do /dashboard.
 * Quem soma é `addView` (src/lib/views.ts), junto com o total.
 */
export const PageViewDays: CollectionConfig = {
  slug: 'page-view-days',
  labels: { singular: 'Visualização por dia', plural: 'Visualizações por dia' },
  admin: { hidden: true, useAsTitle: 'path' },
  defaultSort: '-day',
  // Uma linha por página + dia; o banco recusa duplicatas.
  indexes: [{ fields: ['path', 'day'], unique: true }],
  access: {
    create: () => false,
    read: ({ req }) => Boolean(req.user),
    update: () => false,
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'path', type: 'text', required: true },
    // Texto "2026-10-20" (dia no horário de Brasília): ordena certo e não sofre com fuso.
    { name: 'day', type: 'text', required: true, index: true },
    { name: 'views', type: 'number', defaultValue: 0 },
    { name: 'visitors', type: 'number', defaultValue: 0 },
  ],
}
