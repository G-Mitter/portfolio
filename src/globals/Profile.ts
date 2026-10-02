import type { GlobalConfig } from 'payload'

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
