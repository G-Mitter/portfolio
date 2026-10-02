import type { Profile } from '@/payload-types'

/**
 * "Como eu trabalho": as etapas de um projeto, cadastradas em /admin > Perfil.
 * Mostra para o cliente o que acontece depois que ele entra em contato,
 * o que tira a insegurança de "e agora, como funciona?".
 * Usa <ol> (lista numerada) porque a ordem importa; o número vem do CSS.
 */
export function Process({ steps }: { steps: Profile['process'] }) {
  if (!steps?.length) return null

  return (
    <section className="process" aria-labelledby="processo-titulo">
      <h2 id="processo-titulo">Como eu trabalho</h2>
      <p>O que acontece depois que você entra em contato.</p>
      <ol>
        {steps.map((step) => (
          <li key={step.id ?? step.title}>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
