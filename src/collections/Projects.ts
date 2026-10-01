import type { CollectionConfig } from 'payload'

import { publishedOrLoggedIn } from '../access/publishedOrLoggedIn'
import { slugify } from '../lib/slugify'

/**
 * Coleção "projects": cada documento é um post do feed.
 *
 * Uma "collection" no Payload é parecida com uma tabela no banco:
 * a lista `fields` abaixo vira as colunas, e o Payload gera sozinho
 * o formulário do /admin, a API REST/GraphQL e os tipos TypeScript.
 *
 * Os nomes dos campos ficam em inglês (padrão de mercado no código),
 * e os `label` ficam em português (o que você vê no painel).
 */
export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: { singular: 'Projeto', plural: 'Projetos' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'progress', 'pinned', 'date', '_status'],
  },
  // `drafts: true` adiciona o botão "Salvar rascunho" e o campo `_status`
  // (draft/published). É isso que permite preparar um post antes de publicar.
  versions: {
    drafts: true,
  },
  // Ordem padrão do feed: fixados primeiro, depois os mais recentes.
  defaultSort: ['-pinned', '-date'],
  access: {
    read: publishedOrLoggedIn,
  },
  fields: [
    {
      name: 'title',
      label: 'Título',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      label: 'Slug (URL)',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Gerado a partir do título se ficar vazio. Ex.: /projetos/wincorretor',
      },
      hooks: {
        // Um "hook" é uma função que o Payload roda num momento específico.
        // beforeValidate roda antes de salvar: se o slug estiver vazio,
        // criamos um a partir do título.
        beforeValidate: [
          ({ value, data }) => {
            if (typeof value === 'string' && value.length > 0) return slugify(value)
            if (typeof data?.title === 'string') return slugify(data.title)
            return value
          },
        ],
      },
    },
    {
      name: 'summary',
      label: 'Resumo (legenda do post)',
      type: 'textarea',
      required: true,
      maxLength: 160,
    },
    {
      name: 'result',
      label: 'Resultado',
      type: 'text',
      admin: {
        description: 'O número de impacto. Ex.: "−4 h/dia de trabalho manual"',
      },
    },
    {
      name: 'description',
      label: 'Descrição completa',
      type: 'richText',
    },
    {
      name: 'cover',
      label: 'Imagem de capa',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Opcional. Sem imagem, o site gera uma capa com a cor da categoria.',
      },
    },
    {
      name: 'coverCode',
      label: 'Trecho de código da capa gerada',
      type: 'text',
      admin: {
        description: 'Aparece na capa gerada. Ex.: fn corrigir(txt) -> String',
      },
    },
    {
      name: 'gallery',
      label: 'Galeria',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
    },
    {
      name: 'stack',
      label: 'Tecnologias',
      type: 'text',
      hasMany: true,
      required: true,
    },
    {
      name: 'category',
      label: 'Categoria',
      type: 'select',
      required: true,
      options: [
        { label: 'Automação', value: 'automation' },
        { label: 'Web', value: 'web' },
        { label: 'IA', value: 'ai' },
        { label: 'Dados', value: 'data' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      // Chamado 'progress' (e não 'status') porque o Payload já usa '_status'
      // para rascunho/publicado, e os dois nomes gerariam o mesmo tipo no Postgres.
      name: 'progress',
      label: 'Andamento do projeto',
      type: 'select',
      required: true,
      defaultValue: 'done',
      options: [
        { label: 'Em andamento', value: 'in-progress' },
        { label: 'Concluído', value: 'done' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'date',
      label: 'Data',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { position: 'sidebar' },
    },
    {
      name: 'pinned',
      label: 'Fixar no topo do feed',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'links',
      label: 'Links',
      type: 'group',
      fields: [
        { name: 'repository', label: 'Repositório', type: 'text' },
        { name: 'demo', label: 'Demo', type: 'text' },
      ],
    },
  ],
}
