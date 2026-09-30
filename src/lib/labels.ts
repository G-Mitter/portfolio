import type { Project } from '@/payload-types'

/**
 * Textos que aparecem no site para cada valor salvo no banco.
 * O banco guarda 'in-progress'; a tela mostra 'Em andamento'.
 * Manter isso num lugar só evita escrever o mesmo texto em vários componentes.
 */
export const CATEGORY_LABELS: Record<Project['category'], string> = {
  automation: 'Automação',
  web: 'Web',
  ai: 'IA',
  data: 'Dados',
}

export const CATEGORY_ICONS: Record<Project['category'], string> = {
  automation: '⚙',
  web: '</>',
  ai: '✦',
  data: '▤',
}

export const STATUS_LABELS: Record<Project['progress'], string> = {
  'in-progress': 'Em andamento',
  done: 'Concluído',
}
