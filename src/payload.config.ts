import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { pt } from '@payloadcms/translations/languages/pt'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Projects } from './collections/Projects'
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
  collections: [Projects, Media, Users],
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
  sharp,
  plugins: [],
})
