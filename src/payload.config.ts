import { postgresAdapter } from '@payloadcms/db-postgres'
import { resendAdapter } from '@payloadcms/email-resend'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { pt } from '@payloadcms/translations/languages/pt'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Projects } from './collections/Projects'
import { Likes } from './collections/Likes'
import { Messages } from './collections/Messages'
import { Profile } from './globals/Profile'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Projects, Messages, Likes, Media, Users],
  globals: [Profile],
  // Painel /admin em português
  i18n: {
    supportedLanguages: { pt },
    fallbackLanguage: 'pt',
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    // Em desenvolvimento o Payload ajusta as tabelas sozinho ("push").
    // Em produção isso é perigoso (pode apagar dados), então usamos migrations:
    // arquivos em src/migrations com os comandos SQL, versionados no Git,
    // que rodam automaticamente quando o site sobe.
    // Mudou uma coleção? Rode `pnpm payload migrate:create nome-da-mudanca`.
    prodMigrations: migrations,
  }),
  // Envio de e-mail (aviso de mensagem nova do formulário) pelo Resend.
  // Sem a variável RESEND_API_KEY (no seu computador), o Payload só escreve
  // o e-mail no terminal em vez de enviar.
  // EMAIL_FROM: remetente. O padrão onboarding@resend.dev funciona sem domínio
  // próprio, mas só entrega no e-mail da sua conta do Resend.
  email: process.env.RESEND_API_KEY
    ? resendAdapter({
        apiKey: process.env.RESEND_API_KEY,
        defaultFromAddress: process.env.EMAIL_FROM || 'onboarding@resend.dev',
        defaultFromName: 'Portfólio',
      })
    : undefined,
  sharp,
  plugins: [
    // Onde as imagens enviadas pelo /admin ficam guardadas.
    // Na Vercel o disco do servidor é apagado a cada deploy, então em produção
    // os arquivos vão para o Vercel Blob (um "HD na nuvem").
    // A Vercel cria a variável BLOB_READ_WRITE_TOKEN quando você liga o Blob
    // no projeto. Sem ela (no seu computador), o plugin fica desligado e as
    // imagens continuam indo para a pasta media/, como antes.
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      token: process.env.BLOB_READ_WRITE_TOKEN,
      collections: { media: true },
      // Cria as mesmas colunas no banco com o plugin ligado ou desligado,
      // para o banco do seu computador e o de produção terem o mesmo formato.
      alwaysInsertFields: true,
      // O navegador envia a imagem direto para o Blob. Sem isso, imagens
      // acima de 4,5 MB seriam recusadas pelo limite das funções da Vercel.
      clientUploads: true,
    }),
  ],
})
