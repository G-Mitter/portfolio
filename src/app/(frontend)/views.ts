'use server'

import { cookies } from 'next/headers'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { addView } from '@/lib/views'

/**
 * Soma uma visualização na página. `firstVisit` diz se é a primeira vez
 * deste navegador nesta página (para contar visitantes diferentes).
 */
export async function countView(path: string, firstVisit: boolean): Promise<void> {
  // Só a página inicial e páginas de projeto, para ninguém criar linhas com endereço inventado.
  const match = /^\/(?:projetos\/([a-z0-9-]{1,100}))?$/.exec(String(path))
  if (!match) return
  // Você logado no /admin não conta (o Payload guarda o login neste cookie).
  if ((await cookies()).has('payload-token')) return

  const payload = await getPayload({ config })
  if (match[1]) {
    const { totalDocs } = await payload.count({
      collection: 'projects',
      where: { slug: { equals: match[1] } },
      overrideAccess: false,
    })
    if (!totalDocs) return
  }

  await addView(payload, path, firstVisit)
}
