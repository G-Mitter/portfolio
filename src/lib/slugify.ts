/**
 * Transforma um título em "slug": o pedaço da URL que identifica o projeto.
 *
 * Exemplo: "Portal de TI (Knowledge Base)" -> "portal-de-ti-knowledge-base"
 *
 * Passo a passo:
 * 1. normalize('NFD') separa a letra do acento ("ç" vira "c" + "¸").
 * 2. O regex remove esses acentos soltos (faixa Unicode ̀-ͯ).
 * 3. Tudo que não for letra ou número vira hífen.
 * 4. Removemos hífens repetidos e hífens nas pontas.
 */
export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
