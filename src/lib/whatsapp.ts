/**
 * Monta o link que abre uma conversa no WhatsApp: https://wa.me/<número>?text=<mensagem>
 *
 * O wa.me exige o número só com dígitos e com o código do país (55 no Brasil).
 * Assim, no /admin dá para digitar do jeito que for mais fácil:
 * "(31) 99999-0000", "31999990000" ou "+55 31 99999-0000" geram o mesmo link.
 *
 * Passo a passo:
 * 1. Tiramos tudo que não é dígito.
 * 2. Com 10 ou 11 dígitos (DDD + número), falta o país: colocamos 55 na frente.
 * 3. Fora de 12 ou 13 dígitos o número está incompleto: devolvemos null e o botão some.
 * 4. A mensagem vai codificada (espaços e acentos viram %20, %C3%A1...).
 */
export function whatsappUrl(phone: string | null | undefined, message?: string): string | null {
  let digits = (phone ?? '').replace(/\D/g, '')
  if (digits.length === 10 || digits.length === 11) digits = `55${digits}`
  if (digits.length < 12 || digits.length > 13) return null

  const text = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${digits}${text}`
}

/**
 * Mensagem que já vem escrita quando o visitante abre o WhatsApp pelo site.
 * Fala do problema do cliente (um processo manual), não só "vi seu portfólio",
 * para a conversa já começar pelo que importa.
 */
export function contactMessage(name: string): string {
  const firstName = name.split(' ')[0]
  return `Olá, ${firstName}! Acessei seu site e tenho um processo manual na minha empresa que gostaria de automatizar. Podemos conversar?`
}
