import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

let payload: Payload
const createdIds: number[] = []

// Teste de integração: usa o Payload de verdade com o banco de testes.
describe('Projetos', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
  })

  afterAll(async () => {
    for (const id of createdIds) {
      await payload.delete({ collection: 'projects', id })
    }
  })

  it('gera o slug a partir do título', async () => {
    const project = await payload.create({
      collection: 'projects',
      data: {
        title: 'Teste de Integração Ação',
        summary: 'Projeto criado pelo teste.',
        stack: ['TypeScript'],
        category: 'web',
        progress: 'done',
        date: '2026-01-01',
        _status: 'published',
      },
    })
    createdIds.push(project.id)
    expect(project.slug).toBe('teste-de-integracao-acao')
  })

  it('esconde rascunhos de visitantes', async () => {
    const draft = await payload.create({
      collection: 'projects',
      draft: true,
      data: {
        title: 'Rascunho secreto',
        summary: 'Não deve aparecer no feed.',
        stack: ['TypeScript'],
        category: 'web',
        progress: 'in-progress',
        date: '2026-01-01',
        _status: 'draft',
      },
    })
    createdIds.push(draft.id)

    // overrideAccess: false = consulta com as permissões de um visitante (sem login)
    const asVisitor = await payload.find({
      collection: 'projects',
      where: { slug: { equals: 'rascunho-secreto' } },
      overrideAccess: false,
    })
    expect(asVisitor.totalDocs).toBe(0)

    // Sem restrição (como o admin logado), o rascunho existe
    const asAdmin = await payload.find({
      collection: 'projects',
      where: { slug: { equals: 'rascunho-secreto' } },
      draft: true,
    })
    expect(asAdmin.totalDocs).toBe(1)
  })
  it('coloca o projeto novo no topo da lista', async () => {
    const base = {
      summary: 'Teste de ordem.',
      stack: ['TypeScript'],
      category: 'web' as const,
      progress: 'done' as const,
      date: '2026-01-01',
      _status: 'published' as const,
    }
    const older = await payload.create({
      collection: 'projects',
      data: { ...base, title: 'Ordem antigo' },
    })
    const newer = await payload.create({
      collection: 'projects',
      data: { ...base, title: 'Ordem novo' },
    })
    createdIds.push(older.id, newer.id)

    // `_order` é comparado como texto: o menor aparece primeiro.
    expect(newer._order! < older._order!).toBe(true)

    const first = await payload.find({ collection: 'projects', sort: '_order', limit: 1 })
    expect(first.docs[0]?.id).toBe(newer.id)
  })
})
