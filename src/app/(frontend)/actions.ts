'use server'

/**
 * 'use server' transforma as funções deste arquivo em Server Actions:
 * o formulário chama a função como se ela estivesse no navegador, mas ela
 * roda no servidor. Assim o código que grava no banco nunca vai para o visitante.
 */
import { getPayload } from 'payload'

import config from '@/payload.config'
import { type ContactErrors, type ContactInput, validateContact } from '@/lib/contact'

export type ContactState = {
  status: 'idle' | 'sent' | 'error'
  message?: string
  errors?: ContactErrors
  /** O que a pessoa digitou, para devolver aos campos quando algo dá errado. */
  values?: Partial<ContactInput>
}

/** Teto de mensagens por hora no site todo, para um robô não encher o banco. */
const MAX_PER_HOUR = 30

export async function sendMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // "Pote de mel": um campo escondido que pessoas não veem e robôs preenchem.
  // Se veio preenchido, fingimos que deu certo e não salvamos nada.
  if (formData.get('website')) return { status: 'sent' }

  const raw = Object.fromEntries(formData)
  const result = validateContact(raw)
  // Depois do envio o React limpa o formulário; devolvemos o texto para a pessoa não perder o que escreveu.
  const values = {
    name: String(raw.name ?? ''),
    contact: String(raw.contact ?? ''),
    problem: String(raw.problem ?? ''),
  }
  if (!result.ok) {
    return {
      status: 'error',
      message: 'Confira os campos marcados.',
      errors: result.errors,
      values,
    }
  }

  const source = String(formData.get('source') ?? '')
  const payload = await getPayload({ config })

  const lastHour = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const recent = await payload.count({
    collection: 'messages',
    where: { createdAt: { greater_than: lastHour } },
  })
  if (recent.totalDocs >= MAX_PER_HOUR) {
    return {
      status: 'error',
      message: 'Muitas mensagens agora. Tente pelo WhatsApp ou e-mail.',
      values,
    }
  }

  try {
    // A Local API ignora as regras de acesso por padrão (overrideAccess),
    // por isso consegue criar mesmo com `create: () => false` na coleção.
    await payload.create({
      collection: 'messages',
      data: {
        ...result.data,
        // Só aceita um slug simples (letras, números e hífens).
        source: /^[a-z0-9-]{1,100}$/.test(source) ? source : undefined,
      },
    })
  } catch (error) {
    payload.logger.error({ err: error }, 'Falha ao salvar mensagem de contato')
    return {
      status: 'error',
      message: 'Não consegui enviar agora. Tente pelo WhatsApp ou e-mail.',
      values,
    }
  }

  return { status: 'sent' }
}
