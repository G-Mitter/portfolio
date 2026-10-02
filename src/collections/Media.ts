import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Mídia', plural: 'Mídias' },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      label: 'Texto alternativo (descreve a imagem para leitores de tela)',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    // Só imagens e PDF (o currículo). Bloqueia, por exemplo, um .html ou .svg
    // com código escondido que rodaria ao ser aberto pelo endereço do site.
    mimeTypes: [
      'image/png',
      'image/jpeg',
      'image/webp',
      'image/gif',
      'image/avif',
      'application/pdf',
    ],
  },
}
