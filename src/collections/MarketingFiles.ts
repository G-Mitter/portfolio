import { del, list, put } from '@vercel/blob'
import type { CollectionConfig, PayloadHandler } from 'payload'

import { expiredFolders, loadPosts } from '@/lib/marketing'

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
  endpoints: [
    // Envio em partes: a Vercel recusa corpo acima de 4,5 MB, então arquivos grandes (Reels) chegam em pedaços
    // de até 4 MB (POST /api/marketing-files/parte?envio=<id>&n=<0,1,2...>) e /juntar monta o arquivo único.
    { path: '/parte', method: 'post', handler: (req) => withUser(req, () => savePart(req)) },
    { path: '/juntar', method: 'post', handler: (req) => withUser(req, () => joinParts(req)) },
    // Rotina diária da Vercel (vercel.json): apaga os arquivos dos posts que passaram 5 dias da data.
    { path: '/limpar', method: 'get', handler: cleanup },
  ],
  upload: {
    // Mesma ideia da Mídia: nada de .html/.svg que rodaria código ao abrir.
    mimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'video/mp4', 'application/pdf', 'text/plain', 'text/markdown'],
  },
}

const PARTS = 'marketing-partes'
const json = (body: unknown, status = 200) => Response.json(body, { status })
const validId = (id: unknown): id is string => typeof id === 'string' && /^[\w-]{8,64}$/.test(id)

async function withUser(req: Parameters<PayloadHandler>[0], run: () => Promise<Response>) {
  if (!req.user) return json({ error: 'Faça login ou use a chave de API.' }, 401)
  if (!process.env.BLOB_READ_WRITE_TOKEN) return json({ error: 'Envio em partes só funciona com o Vercel Blob ligado.' }, 400)
  return run()
}

async function savePart(req: Parameters<PayloadHandler>[0]) {
  const id = req.searchParams.get('envio')
  const n = Number(req.searchParams.get('n'))
  if (!validId(id) || !Number.isInteger(n) || n < 0 || n > 999 || !req.arrayBuffer) return json({ error: 'Informe envio e n.' }, 400)
  const body = Buffer.from(await req.arrayBuffer())
  await put(`${PARTS}/${id}/${String(n).padStart(3, '0')}`, body, { access: 'public', addRandomSuffix: true })
  return json({ ok: true, n, bytes: body.length })
}

async function joinParts(req: Parameters<PayloadHandler>[0]) {
  const { envio, pasta, filename, mimeType } = ((await req.json?.()) ?? {}) as Record<string, unknown>
  if (!validId(envio) || typeof pasta !== 'string' || !pasta || typeof filename !== 'string' || !filename || typeof mimeType !== 'string')
    return json({ error: 'Informe envio, pasta, filename e mimeType.' }, 400)
  const { blobs } = await list({ prefix: `${PARTS}/${envio}/` })
  if (!blobs.length) return json({ error: 'Nenhuma parte recebida.' }, 400)
  blobs.sort((a, b) => a.pathname.localeCompare(b.pathname))
  const parts = await Promise.all(blobs.map(async (b) => Buffer.from(await (await fetch(b.url, { cache: 'no-store' })).arrayBuffer())))
  const data = Buffer.concat(parts)
  // O próprio Payload confere o tipo do arquivo (mimeTypes acima) e grava no Blob como um envio normal.
  const doc = await req.payload.create({
    collection: 'marketing-files',
    data: { pasta },
    file: { data, mimetype: mimeType, name: filename, size: data.length },
    overrideAccess: false,
    user: req.user,
  })
  await del(blobs.map((b) => b.url))
  return json({ doc }, 201)
}

async function cleanup(req: Parameters<PayloadHandler>[0]) {
  // A Vercel manda "Authorization: Bearer <CRON_SECRET>" nas rotinas.
  if (!process.env.CRON_SECRET || req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`)
    return json({ error: 'Não autorizado.' }, 401)
  const { posts, error } = await loadPosts()
  if (error) return json({ error }, 502) // sem agenda, não apaga nada
  const pastas = expiredFolders(posts)
  if (!pastas.length) return json({ pastas, apagados: 0 })
  const { docs } = await req.payload.delete({ collection: 'marketing-files', where: { pasta: { in: pastas } } })
  return json({ pastas, apagados: docs.length })
}
