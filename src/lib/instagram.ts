/**
 * Monta o link do perfil do Instagram a partir do que foi digitado no /admin.
 * Aceita "@usuario", "usuario", "instagram.com/usuario" ou o link completo:
 * todos viram https://www.instagram.com/usuario/
 *
 * Nome de usuário do Instagram: até 30 letras, números, pontos ou "_".
 * Se o texto não parecer um usuário válido, devolvemos null e o botão some.
 */
export function instagramUrl(value: string | null | undefined): string | null {
  const text = (value ?? '').trim()
  if (!text) return null

  const user = text
    .replace(/^https?:\/\//i, '')
    .replace(/^(www\.)?instagram\.com\//i, '')
    .replace(/^@/, '')
    .split(/[/?#]/)[0]

  if (!/^[A-Za-z0-9._]{1,30}$/.test(user)) return null
  return `https://www.instagram.com/${user}/`
}
