/**
 * Script de "seed": popula o banco com os posts de exemplo do protótipo.
 * Útil para ver o feed funcionando logo depois de instalar o projeto.
 *
 * Rodar com:  pnpm seed
 *
 * Ele é "idempotente": pode rodar várias vezes sem duplicar posts,
 * porque procura cada projeto pelo slug antes de criar.
 */
import { getPayload } from 'payload'

import config from '../payload.config'
import type { Project } from '../payload-types'
import { slugify } from '../lib/slugify'

/** O campo de texto rico guarda JSON no formato do editor Lexical. Esta função monta um parágrafo simples. */
function paragraph(text: string): NonNullable<Project['description']> {
  return {
    root: {
      type: 'root',
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
      children: [
        {
          type: 'paragraph',
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
          textFormat: 0,
          children: [
            { type: 'text', text, detail: 0, format: 0, mode: 'normal', style: '', version: 1 },
          ],
        },
      ],
    },
  }
}

type SeedProject = Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'description'> & {
  description: string
}

const projects: SeedProject[] = [
  {
    title: 'Este portfólio',
    summary: 'Meu próprio portfólio, com painel admin para publicar projetos como posts.',
    result: 'Sprint 3 de 8',
    description:
      'Feed estilo Instagram com página de detalhe por projeto. Os posts são cadastrados num painel /admin gerado pelo Payload CMS, dentro do próprio Next.js.',
    coverCode: 'npx create-payload-app',
    stack: ['Next.js', 'Payload CMS', 'TypeScript', 'PostgreSQL'],
    category: 'web',
    progress: 'in-progress',
    date: '2026-09-30',
    pinned: true,
    links: { repository: 'https://github.com/G-Mitter/portfolio' },
  },
  {
    title: 'WinCorretor',
    summary: 'Corrige texto e muda o tom em qualquer programa do Windows.',
    result: 'Rust + LLM',
    description:
      'Selecione um texto em qualquer app, acione um atalho e o WinCorretor devolve a versão corrigida ou reescrita no tom escolhido usando uma API de IA.',
    coverCode: 'fn corrigir(txt) -> String',
    stack: ['Rust', 'API de IA', 'Windows'],
    category: 'ai',
    progress: 'in-progress',
    date: '2026-09-15',
    links: { repository: 'https://github.com/G-Mitter/WinCorretor' },
  },
  {
    title: 'SupplyFlow',
    summary: 'Gestão de suprimentos, automação de estoque e inteligência financeira.',
    description:
      'Sistema sobre Google Workspace que centraliza pedidos de suprimento, automatiza o controle de estoque e gera indicadores financeiros para a gestão.',
    coverCode: 'onFormSubmit(e) { … }',
    stack: ['JavaScript', 'Apps Script', 'Google Workspace', 'Excel'],
    category: 'automation',
    progress: 'done',
    date: '2026-06-01',
    links: { repository: 'https://github.com/G-Mitter/SupplyFlow' },
  },
  {
    title: 'Conciliador',
    summary: 'Concilia o contas a receber com o extrato bancário.',
    description:
      'Lê o relatório de vendas do contas a receber e o extrato do banco, cruza os lançamentos e aponta o que não bate.',
    coverCode: 'df.merge(extrato, on=…)',
    stack: ['Python', 'Excel'],
    category: 'data',
    progress: 'done',
    date: '2026-04-01',
  },
  {
    title: 'Portal de TI',
    summary: 'Base de conhecimento com alertas de queda de servidor em tempo real.',
    result: '23 filiais',
    description:
      'Portal interno que centraliza manuais e boas práticas para as lojas, com um sistema dinâmico de alertas para comunicar quedas de servidor.',
    coverCode: '<alert status="down">',
    stack: ['HTML', 'CSS', 'JavaScript', 'GitHub Pages'],
    category: 'web',
    progress: 'done',
    date: '2025-10-01',
  },
  {
    title: 'BI Financeiro',
    summary: 'Banco de dados para BI e envio automático de metas via WhatsApp.',
    result: 'Relatórios via WhatsApp',
    description:
      'Modelagem do banco MySQL que sustenta o BI financeiro, otimizando o fechamento de caixa e enviando relatórios de metas aos gerentes regionais.',
    coverCode: 'SELECT loja, SUM(meta)',
    stack: ['MySQL', 'API WhatsApp', 'BI'],
    category: 'data',
    progress: 'done',
    date: '2025-07-01',
  },
  {
    title: 'Automações RPA',
    summary: 'Fluxos que eliminam tarefas manuais do backoffice.',
    result: '−4 h/dia',
    description:
      'Fluxos no Microsoft Power Automate que substituem tarefas repetitivas do backoffice, economizando cerca de 4 horas diárias de trabalho da equipe.',
    coverCode: 'trigger → flow → done',
    stack: ['Power Automate', 'RPA'],
    category: 'automation',
    progress: 'done',
    date: '2025-03-01',
  },
]

async function seed() {
  const payload = await getPayload({ config })

  for (const { description, ...project } of projects) {
    const slug = slugify(project.title)
    const existing = await payload.find({
      collection: 'projects',
      where: { slug: { equals: slug } },
      limit: 1,
    })
    if (existing.totalDocs > 0) {
      payload.logger.info(`Já existe: ${project.title}`)
      continue
    }
    await payload.create({
      collection: 'projects',
      data: { ...project, slug, description: paragraph(description), _status: 'published' },
    })
    payload.logger.info(`Criado: ${project.title}`)
  }

  await payload.updateGlobal({
    slug: 'profile',
    data: {
      name: 'Guilherme Mitter',
      stats: [
        { value: '4h/dia', label: 'economizadas' },
        { value: '23', label: 'filiais atendidas' },
      ],
    },
  })
  payload.logger.info('Perfil atualizado. Seed concluído.')
  process.exit(0)
}

await seed()
