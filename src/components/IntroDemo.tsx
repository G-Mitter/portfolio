'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'

/**
 * Exemplos do que o Guilherme entrega (dados fictícios), um por vez, no topo da home.
 * Troca sozinho a cada 5 s. Pausa com o mouse, com o foco ou no botão de pausa.
 * Quem pediu "reduzir movimento" no aparelho vê o primeiro, parado, e troca pelos pontos.
 */
const SLIDES = [
  {
    tag: 'Conciliação',
    title: 'Divergências da semana',
    rows: [
      ['Depósito não recebido', 'Filial 07', 'R$ 1.240,00'],
      ['Venda sem baixa', 'Filial 12', 'R$ 389,90'],
      ['Taxa cobrada a mais', 'Filial 03', 'R$ 86,40'],
    ],
    foot: '5 auditorias em uma execução',
  },
  {
    tag: 'Cadastro automatizado',
    title: 'Cadastro de produtos',
    rows: [
      ['Camiseta básica azul', 'Foto e descrição prontas', 'publicado'],
      ['Calça jeans slim', 'Foto e descrição prontas', 'publicado'],
      ['Tênis casual branco', 'Foto e descrição prontas', 'publicado'],
    ],
    foot: 'Um lote de produtos em minutos',
  },
  {
    tag: 'RPA',
    title: 'Robô de carga dos caixas',
    rows: [
      ['Caixa 101', 'Produtos novos enviados', 'ok'],
      ['Caixa 104', 'Preços alterados enviados', 'ok'],
      ['Caixa 107', 'Promoções enviadas', 'ok'],
    ],
    foot: 'Uma manhã por dia economizada',
  },
  {
    tag: 'Análise de dados',
    title: 'Painel de vendas',
    rows: [
      ['Maior queda da semana', 'Filial 09', '−12%'],
      ['Produto que mais cresceu', 'Linha A', '+8%'],
      ['Margem real do mês', 'Todas as filiais', '31%'],
    ],
    foot: 'Os números sem montar planilha',
  },
  {
    tag: 'Programação',
    title: 'Sistema sob medida',
    rows: [
      ['Cadastro de clientes', 'Sistema web', 'no ar'],
      ['Relatório automático', 'Por e-mail, toda segunda', 'agendado'],
      ['Integração com o sistema da loja', 'Sem digitar de novo', 'ativa'],
    ],
    foot: 'Feito para o jeito da sua empresa',
  },
] as const

const SLIDE_MS = 5000

// true quando o aparelho pediu menos movimento; no servidor devolve null ("ainda não sei").
function useReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia('(prefers-reduced-motion: reduce)')
      media.addEventListener('change', onChange)
      return () => media.removeEventListener('change', onChange)
    },
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => null,
  )
}

export function IntroDemo() {
  const [index, setIndex] = useState(0)
  const [hover, setHover] = useState(false)
  const [paused, setPaused] = useState(false)
  const still = useReducedMotion() !== false // null (servidor) também começa parado

  useEffect(() => {
    if (still || hover || paused) return
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), SLIDE_MS)
    return () => clearInterval(id)
  }, [still, hover, paused, index])

  return (
    <div
      className="intro-demo"
      role="group"
      aria-roledescription="carrossel"
      aria-label="Exemplos do que eu entrego (dados fictícios)"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
    >
      {/* Todos os cartões ocupam o mesmo lugar: a caixa tem sempre a altura do maior, sem pular. */}
      <div className="demo-slides" aria-live="off">
        {SLIDES.map((slide, i) => (
          <div key={slide.tag} className="demo-slide" data-active={i === index} aria-hidden={i !== index}>
            <p className="demo-tag">{slide.tag}</p>
            <p className="intro-demo-title">{slide.title}</p>
            <ul>
              {slide.rows.map(([what, where, value]) => (
                <li key={what}>
                  <span>{what}</span>
                  <b>{where}</b>
                  <em>{value}</em>
                </li>
              ))}
            </ul>
            <p className="intro-demo-foot">
              {slide.foot} <small>dados fictícios</small>
            </p>
          </div>
        ))}
      </div>
      <div className="demo-controls">
        <div className="demo-dots">
          {SLIDES.map((slide, i) => (
            <button
              key={slide.tag}
              type="button"
              aria-label={`Ver exemplo: ${slide.tag}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
        {!still && (
          <button type="button" className="demo-pause" onClick={() => setPaused((p) => !p)}>
            {paused ? 'Retomar' : 'Pausar'}
          </button>
        )}
      </div>
    </div>
  )
}
