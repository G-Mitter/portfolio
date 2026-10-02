import type { CollectionConfig } from 'payload'

import { buildContactEmail } from '../lib/contactEmail'
import { siteUrl } from '../lib/siteUrl'

/**
 * Mensagens enviadas pelo formulário "Vamos conversar?" do site.
 * Você lê em /admin > Mensagens e marca "Respondida" quando retornar o contato.
 */
export const Messages: CollectionConfig = {
  slug: 'messages',
  labels: { singular: 'Mensagem', plural: 'Mensagens' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'contact', 'answered', 'createdAt'],
    description: 'Contatos que chegaram pelo formulário do site.',
  },
  // A mais recente primeiro, como uma caixa de entrada.
  defaultSort: '-createdAt',
  access: {
    // Ninguém cria mensagem pela API pública (/api/messages): só o formulário
    // do site, que roda no servidor e confere os dados antes de salvar.
    // Isso fecha a porta para robôs que enviam spam direto para a API.
    create: () => false,
    // Ler, editar e apagar: só quem está logado no /admin.
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: {
    // afterChange roda depois que a mensagem foi salva no banco.
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create') return doc
        // O aviso vai para o "E-mail de contato" de /admin > Perfil.
        const profile = await req.payload.findGlobal({ slug: 'profile', depth: 0, req })
        const to = profile.links?.email
        if (!to) return doc
        try {
          await req.payload.sendEmail({ to, ...buildContactEmail(doc, siteUrl) })
        } catch (error) {
          // Se o e-mail falhar, a mensagem continua salva no /admin.
          // Por isso só registramos o erro em vez de mostrar falha para o visitante.
          req.payload.logger.error({ err: error }, 'Falha ao enviar o aviso de mensagem nova')
        }
        return doc
      },
    ],
  },
  fields: [
    { name: 'name', label: 'Nome', type: 'text', required: true },
    { name: 'contact', label: 'E-mail ou telefone', type: 'text', required: true },
    { name: 'problem', label: 'O que a pessoa precisa', type: 'textarea', required: true },
    {
      name: 'source',
      label: 'Veio do projeto',
      type: 'text',
      admin: {
        description: 'Preenchido quando a pessoa clicou em "Quer algo parecido?" num projeto.',
      },
    },
    {
      name: 'answered',
      label: 'Respondida',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
  ],
}
