import type { CollectionConfig } from 'payload'

/**
 * Visitas por lugar e por dia: país, cidade e coordenadas aproximadas (1 casa decimal, nível de cidade).
 * Vem dos cabeçalhos que a Vercel manda (x-vercel-ip-*). Conta uma vez por visita, só a contagem:
 * o IP nunca é gravado. Quem soma é `addPlace` (src/lib/views.ts). Alimenta o mapa do /dashboard.
 */
export const PageViewPlaces: CollectionConfig = {
  slug: 'page-view-places',
  labels: { singular: 'Visitas por lugar', plural: 'Visitas por lugar' },
  admin: { hidden: true, useAsTitle: 'city' },
  defaultSort: '-day',
  indexes: [{ fields: ['day', 'country', 'city'], unique: true }],
  access: {
    create: () => false,
    read: ({ req }) => Boolean(req.user),
    update: () => false,
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'day', type: 'text', required: true, index: true },
    { name: 'country', type: 'text', required: true },
    { name: 'city', type: 'text', defaultValue: '' },
    { name: 'lat', type: 'number' },
    { name: 'lon', type: 'number' },
    { name: 'visits', type: 'number', defaultValue: 0 },
  ],
}
