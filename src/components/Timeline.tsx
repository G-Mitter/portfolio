import Image from 'next/image'

/**
 * "Minha trajetória": marcos da carreira em ordem, do mais antigo ao mais recente.
 * Os textos vêm do currículo e ficam aqui no código (como a lista de vídeos da home);
 * sem nome de empresa, de propósito. Usa <ol> porque a ordem importa.
 */
const MILESTONES = [
  {
    period: 'Jun/2022 a Nov/2024',
    title: 'Operações digitais em uma loja de utilidades domésticas',
    text: 'Implantei o e-commerce do zero (site próprio e marketplaces) e levei o faturamento digital de R$ 0 para R$ 120 mil por mês. Integrei Shopee e Mercado Livre ao ERP, com dados fiscais e logísticos corretos nos pedidos.',
  },
  {
    period: 'Nov/2024 até hoje',
    title: 'Suporte de TI e automação em uma rede de 23 lojas',
    text: 'Suporte e infraestrutura de 23 filiais e do escritório, e as primeiras automações: o robô de carga dos caixas (uma manhã inteira por dia economizada), o SupplyFlow e o BI de fechamento de caixa e metas.',
  },
  {
    period: 'Jan/2025',
    title: 'Técnico em Análise e Desenvolvimento de Sistemas (SENAC RS)',
    text: 'Curso concluído. Projeto do curso: o Not Chicken, com Java, Spring Boot, MySQL e API REST.',
  },
  {
    period: '2026 em diante',
    title: 'Python, IA e projetos próprios',
    text: 'Conciliador em Python (5 auditorias em uma execução), portal de suporte para as lojas e o WinCorretor, aplicativo para Windows com Rust, Tauri e IA.',
  },
  {
    period: 'Hoje',
    title: 'Este portfólio e graduação em andamento',
    text: 'Este site, feito com Next.js e Payload CMS, e o Tecnólogo em Análise e Desenvolvimento de Sistemas (Estácio, previsão Dez/2027).',
  },
]

export function Timeline() {
  return (
    <section className="timeline band band-dark" aria-labelledby="trajetoria-titulo">
      <h2 id="trajetoria-titulo">Minha trajetória</h2>
      <Image
        className="timeline-photo"
        src="/guilherme-trabalhando.jpg"
        alt="Guilherme de perfil, trabalhando em uma mesa com monitor largo e notebook, com o código e o próprio portfólio abertos nas telas"
        width={1200}
        height={675}
        sizes="(min-width: 960px) 934px, 100vw"
      />
      <ol>
        {MILESTONES.map((m) => (
          <li key={m.period}>
            <p className="timeline-period">{m.period}</p>
            <h3>{m.title}</h3>
            <p>{m.text}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
