import type { CollectionConfig } from 'payload'

const loggedIn = ({ req }: { req: { user?: unknown } }) => Boolean(req.user)

/**
 * Arquivos prontos dos posts (imagens, Reels, legendas), para baixar pelo /marketing sem o PC.
 * "Pasta" é o nome da pasta da entrega (ex.: 2026-10-31-reel-robo-carga): é assim que o
 * /marketing liga o arquivo ao evento "[Post]" da agenda. Só quem está logado vê ou baixa.
 */
export const MarketingFiles: CollectionConfig = {
  slug: 'marketing-files',
  labels: { singular: 'Material de marketing', plural: 'Materiais de marketing' },
  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'pasta', 'createdAt'],
    description: 'Arquivos dos posts. Aparecem para baixar em /marketing, no post da mesma pasta.',
  },
  defaultSort: '-createdAt',
  access: { read: loggedIn, create: loggedIn, update: loggedIn, delete: loggedIn },
  fields: [
    {
      name: 'pasta',
      label: 'Pasta da entrega (ex.: 2026-10-31-reel-robo-carga)',
      type: 'text',
      required: true,
      index: true,
    },
  ],
  upload: {
    // Mesma ideia da Mídia: nada de .html/.svg que rodaria código ao abrir.
    mimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'video/mp4', 'application/pdf', 'text/plain', 'text/markdown'],
  },
}
