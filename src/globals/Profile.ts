import type { GlobalConfig } from 'payload'

import { instagramUrl } from '../lib/instagram'

/**
 * "Global" é um documento único (não uma lista). Serve para o topo do site:
 * nome, bio, contadores e links. Você edita em /admin > Perfil,
 * sem precisar mexer no código.
 */
export const Profile: GlobalConfig = {
  slug: 'profile',
  label: 'Perfil',
  access: {
    read: () => true,
  },
  fields: [
    { name: 'name', label: 'Nome', type: 'text', required: true, defaultValue: 'Guilherme Mitter' },
    { name: 'handle', label: 'Usuário', type: 'text', defaultValue: 'guilherme.mitter' },
    { name: 'role', label: 'Cargo', type: 'text', defaultValue: 'Desenvolvedor Júnior' },
    {
      name: 'bio',
      label: 'Bio',
      type: 'textarea',
      defaultValue: 'Automação de processos, web e IA. Transformo tarefas manuais em sistemas.',
    },
    { name: 'location', label: 'Cidade', type: 'text', defaultValue: 'Belo Horizonte, MG' },
    {
      name: 'available',
      label: 'Disponível para projetos',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Mostra o selo verde ao lado do nome. Desmarque quando estiver sem agenda.',
      },
    },
    { name: 'avatar', label: 'Foto', type: 'upload', relationTo: 'media' },
    {
      name: 'stats',
      label: 'Contadores',
      type: 'array',
      maxRows: 3,
      admin: { description: 'O número de projetos é contado sozinho; aqui entram os outros.' },
      fields: [
        { name: 'value', label: 'Valor', type: 'text', required: true },
        { name: 'label', label: 'Descrição', type: 'text', required: true },
      ],
    },
    {
      name: 'skills',
      label: 'Tecnologias',
      type: 'array',
      maxRows: 8,
      admin: {
        description:
          'A lista que aparece logo depois do feed, para recrutadores. Cada grupo tem um nome e as tecnologias separadas por vírgula.',
      },
      fields: [
        { name: 'group', label: 'Grupo', type: 'text', required: true },
        {
          name: 'items',
          label: 'Tecnologias',
          type: 'text',
          required: true,
          admin: { description: 'Separe por vírgula. Ex.: JavaScript, TypeScript, Python' },
        },
      ],
    },
    {
      name: 'services',
      label: 'Como posso ajudar',
      type: 'array',
      maxRows: 4,
      admin: {
        description:
          'Os serviços que aparecem antes do formulário de contato. Escreva pensando no cliente: o problema que você resolve, não a tecnologia.',
      },
      fields: [
        { name: 'title', label: 'Título', type: 'text', required: true },
        { name: 'description', label: 'Descrição', type: 'textarea', required: true },
      ],
    },
    {
      name: 'process',
      label: 'Como eu trabalho',
      type: 'array',
      maxRows: 6,
      admin: {
        description:
          'As etapas de um projeto, do primeiro contato à entrega. Aparecem numeradas, na ordem desta lista (arraste para reordenar).',
      },
      fields: [
        { name: 'title', label: 'Etapa', type: 'text', required: true },
        { name: 'description', label: 'O que acontece', type: 'textarea', required: true },
      ],
    },
    {
      name: 'testimonials',
      label: 'Recomendações',
      type: 'array',
      maxRows: 6,
      labels: { singular: 'Recomendação', plural: 'Recomendações' },
      admin: {
        description:
          'O que clientes e colegas dizem de você. Aparecem antes do formulário de contato, na ordem desta lista. Peça autorização da pessoa antes de publicar.',
      },
      fields: [
        { name: 'photo', label: 'Foto', type: 'upload', relationTo: 'media' },
        { name: 'name', label: 'Nome', type: 'text', required: true },
        {
          name: 'role',
          label: 'Quem é',
          type: 'text',
          admin: { description: 'Opcional. Ex.: Gerente financeiro, Colega no curso técnico' },
        },
        {
          name: 'quote',
          label: 'Comentário',
          type: 'textarea',
          required: true,
          maxLength: 500,
        },
      ],
    },
    {
      name: 'links',
      label: 'Links',
      type: 'group',
      fields: [
        {
          name: 'github',
          label: 'GitHub',
          type: 'text',
          defaultValue: 'https://github.com/G-Mitter',
        },
        {
          name: 'linkedin',
          label: 'LinkedIn',
          type: 'text',
          defaultValue: 'https://www.linkedin.com/in/guilherme-mitter',
        },
        {
          name: 'instagram',
          label: 'Instagram',
          type: 'text',
          admin: { description: 'Seu usuário (@seuperfil) ou o link do perfil.' },
          // Recusa textos que não viram um link de perfil, para o botão não levar a lugar errado.
          validate: (value: string | null | undefined) =>
            !value || instagramUrl(value) !== null || 'Digite o usuário, por exemplo @seuperfil.',
        },
        { name: 'email', label: 'E-mail de contato', type: 'email' },
        {
          name: 'whatsapp',
          label: 'WhatsApp',
          type: 'text',
          admin: {
            description: 'Número com DDD, do jeito que preferir. Ex.: (31) 99999-0000',
          },
          // Recusa números incompletos para o botão não levar a uma conversa errada.
          validate: (value: string | null | undefined) => {
            if (!value) return true
            const digits = value.replace(/\D/g, '')
            return [10, 11, 12, 13].includes(digits.length) || 'Digite o número com DDD.'
          },
        },
        { name: 'resume', label: 'Currículo (PDF)', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
