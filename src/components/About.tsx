import Image from 'next/image'

/**
 * "Quem vai fazer o seu projeto": foto, poucas frases e números medidos.
 * Fica perto do formulário porque é onde o visitante decide se confia em quem vai atender.
 */
export function About() {
  return (
    <section className="about band band-light" aria-labelledby="quem-titulo">
      <Image
        className="about-photo"
        src="/guilherme-recorte.png"
        alt="Guilherme Mitter sorrindo"
        width={1086}
        height={1448}
        sizes="(min-width: 760px) 280px, 60vw"
      />
      <div className="about-text">
        <h2 id="quem-titulo">Quem vai fazer o seu projeto</h2>
        <p>
          Sou o Guilherme, de Belo Horizonte. Cuido da tecnologia de uma rede de 23 lojas, e é de lá que vêm os robôs que
          você viu acima. Você fala direto comigo, do diagnóstico até os ajustes.
        </p>
        <dl className="about-stats">
          <div><dt>1 manhã por dia</dt><dd>economizada com um robô</dd></div>
          <div><dt>23 lojas</dt><dd>atendidas no dia a dia</dd></div>
          <div><dt>R$ 120 mil por mês</dt><dd>de faturamento digital implantado</dd></div>
        </dl>
      </div>
    </section>
  )
}
