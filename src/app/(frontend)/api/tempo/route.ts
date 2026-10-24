import { NextResponse, type NextRequest } from 'next/server'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { parseSeconds } from '@/lib/timing'
import { addTime, isCountablePage } from '@/lib/views'

/**
 * Recebe o tempo que a pessoa ficou na página. O navegador manda este aviso ao sair
 * (navigator.sendBeacon), e Server Action não funciona nesse caso, por isso é uma rota.
 * Corpo: { path, seconds }. Sempre responde 204: quem envia não precisa saber se foi aceito.
 */
export async function POST(request: NextRequest) {
  const ok = new NextResponse(null, { status: 204 })

  // Só aceita avisos vindos do próprio site e ignora você logado no /admin.
  const origin = request.headers.get('origin')
  if (origin && origin !== request.nextUrl.origin) return ok
  if (request.cookies.has('payload-token')) return ok

  let body: { path?: unknown; seconds?: unknown } = {}
  try {
    body = JSON.parse(await request.text())
  } catch {
    return ok
  }
  const seconds = parseSeconds(body?.seconds)
  const path = String(body?.path ?? '')
  if (seconds === null) return ok

  const payload = await getPayload({ config })
  if (await isCountablePage(payload, path)) await addTime(payload, path, seconds)
  return ok
}
