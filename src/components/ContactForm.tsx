'use client'

/**
 * Formulário "Vamos conversar?" do fim da página.
 *
 * useActionState liga o formulário à Server Action `sendMessage`:
 * - `state` é o que a action devolveu da última vez (enviado, erro, erros por campo);
 * - `formAction` vai no action do <form>;
 * - `pending` fica true enquanto envia, para travar o botão.
 * Mesmo com o JavaScript desligado o formulário funciona, porque é um <form> de verdade.
 */
import { useActionState } from 'react'

import { type ContactState, sendMessage } from '@/app/(frontend)/actions'
import { CONTACT_LIMITS } from '@/lib/contact'

const initialState: ContactState = { status: 'idle' }

export function ContactForm({ source }: { source?: string }) {
  const [state, formAction, pending] = useActionState(sendMessage, initialState)

  if (state.status === 'sent') {
    return (
      <p className="form-done" role="status">
        Mensagem recebida! Respondo pelo contato que você deixou.
      </p>
    )
  }

  const errors = state.errors ?? {}
  const values = state.values ?? {}

  return (
    <form className="contact-form" action={formAction}>
      {source && <input type="hidden" name="source" value={source} />}
      {/* Pote de mel: escondido de pessoas (e de leitores de tela), robôs preenchem. */}
      <div className="hp" aria-hidden="true">
        <label>
          Site
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label>
        <span>Seu nome</span>
        <input
          name="name"
          defaultValue={values.name}
          required
          minLength={CONTACT_LIMITS.name.min}
          maxLength={CONTACT_LIMITS.name.max}
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
        />
        {errors.name && <small className="field-error">{errors.name}</small>}
      </label>

      <label>
        <span>E-mail ou WhatsApp</span>
        <input
          name="contact"
          defaultValue={values.contact}
          required
          maxLength={CONTACT_LIMITS.contact.max}
          placeholder="voce@empresa.com ou (31) 99999-0000"
          aria-invalid={Boolean(errors.contact)}
        />
        {errors.contact && <small className="field-error">{errors.contact}</small>}
      </label>

      <label className="full">
        <span>Qual problema você quer resolver?</span>
        <textarea
          name="problem"
          defaultValue={values.problem}
          required
          rows={4}
          minLength={CONTACT_LIMITS.problem.min}
          maxLength={CONTACT_LIMITS.problem.max}
          placeholder="Ex.: toda semana alguém passa horas copiando dados de uma planilha para o sistema."
          aria-invalid={Boolean(errors.problem)}
        />
        {errors.problem && <small className="field-error">{errors.problem}</small>}
      </label>

      <div className="full form-foot">
        <button className="btn primary" type="submit" disabled={pending}>
          {pending ? 'Enviando…' : 'Enviar mensagem'}
        </button>
        {state.message && (
          <span className="form-msg" role="alert">
            {state.message}
          </span>
        )}
      </div>
    </form>
  )
}
