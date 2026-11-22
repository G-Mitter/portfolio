import type { CollectionConfig } from 'payload'

import { slugify } from '../lib/slugify'

const loggedIn = ({ req }: { req: { user?: unknown } }) => Boolean(req.user)

/**
 * Campanhas de marketing. O "Código" liga a campanha aos posts: escreva "campanha: <código>"
 * na descrição do evento [Post] da agenda e o post do Instagram daquele dia entra nesta campanha.
 */
export const Campaigns: CollectionConfig = {
  slug: 'campaigns',
  labels: { singular: 'Campanha', plural: 'Campanhas' },
  admin: {
    useAsTitle: 'nome',
    defaultColumns: ['nome', 'codigo', 'status', 'inicio', 'fim'],
    description: 'Cada campanha junta posts com o mesmo objetivo. O /marketing compara os números delas.',
  },
  defaultSort: '-inicio',
  access: { read: loggedIn, create: loggedIn, update: loggedIn, delete: loggedIn },
  fields: [
    { name: 'nome', label: 'Nome', type: 'text', required: true },
    {
      name: 'codigo',
      label: 'Código',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'Sem espaços nem acentos, ex.: robo-carga-nov. Vai na linha "campanha:" do evento [Post].' },
      hooks: { beforeValidate: [({ value }) => (typeof value === 'string' ? slugify(value) : value)] },
    },
    { name: 'objetivo', label: 'Objetivo', type: 'textarea' },
    { name: 'inicio', label: 'Início', type: 'date', admin: { date: { pickerAppearance: 'dayOnly' } } },
    { name: 'fim', label: 'Fim', type: 'date', admin: { date: { pickerAppearance: 'dayOnly' } } },
    { name: 'orcamento', label: 'Orçamento (R$)', type: 'number', min: 0 },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      defaultValue: 'ativa',
      options: [
        { label: 'Planejada', value: 'planejada' },
        { label: 'Ativa', value: 'ativa' },
        { label: 'Encerrada', value: 'encerrada' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
