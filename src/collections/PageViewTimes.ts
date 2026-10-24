import type { CollectionConfig } from 'payload'

import { BUCKETS } from '@/lib/timing'

/**
 * Tempo na página: por dia, página e faixa (menos de 10 s, 10 a 30 s...), quantas visitas e quantos
 * segundos somaram. A média é segundos ÷ visitas; as faixas mostram a distribuição.
 * Só conta o tempo com a aba visível. Quem soma é `addTime` (src/lib/views.ts), chamado por /api/tempo.
 */
export const PageViewTimes: CollectionConfig = {
  slug: 'page-view-times',
  labels: { singular: 'Tempo na página', plural: 'Tempo na página' },
  admin: { hidden: true, useAsTitle: 'path' },
  defaultSort: '-day',
  indexes: [{ fields: ['day', 'path', 'bucket'], unique: true }],
  access: {
    create: () => false,
    read: ({ req }) => Boolean(req.user),
    update: () => false,
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'day', type: 'text', required: true, index: true },
    { name: 'path', type: 'text', required: true },
    { name: 'bucket', type: 'select', required: true, options: [...BUCKETS] },
    { name: 'visits', type: 'number', defaultValue: 0 },
    { name: 'seconds', type: 'number', defaultValue: 0 },
  ],
}
