/**
 * "Perguntas frequentes": as dúvidas que costumam travar o cliente antes de chamar.
 * Fica logo antes do contato. Cada pergunta usa <details>/<summary>, que o próprio
 * navegador abre e fecha (clique, toque ou Enter no teclado), sem JavaScript.
 * Os textos ficam aqui no código; para somar uma pergunta, é só incluir um item.
 */
const QUESTIONS = [
  {
    q: 'Preciso trocar o sistema da minha empresa?',
    a: 'Não. A automação trabalha em cima do que você já usa: o seu ERP, as suas planilhas, o seu Google.',
  },
  {
    q: 'Quanto custa?',
    a: 'Depende do processo. Depois do diagnóstico grátis você recebe um preço fechado e paga metade no início e metade quando estiver funcionando.',
  },
  {
    q: 'Quanto tempo leva?',
    a: 'Também depende do processo. No diagnóstico eu passo o prazo junto com o preço, e entrego por etapas para você ver o andamento.',
  },
  {
    q: 'E se der problema depois da entrega?',
    a: 'Os primeiros 30 dias de ajustes estão incluídos. Depois disso, o suporte é cobrado pelas horas usadas para resolver.',
  },
  {
    q: 'Você atende fora de Belo Horizonte?',
    a: 'Sim. O atendimento é online, para qualquer cidade.',
  },
  {
    q: 'Meus dados ficam seguros?',
    a: 'Sim. A automação roda nos computadores da sua empresa ou em um servidor só seu, a que apenas a sua empresa tem acesso.',
  },
]

export function Faq() {
  return (
    <section className="faq band band-dark" aria-labelledby="faq-titulo">
      <h2 id="faq-titulo">Perguntas frequentes</h2>
      {QUESTIONS.map((item) => (
        <details key={item.q}>
          <summary>{item.q}</summary>
          <p>{item.a}</p>
        </details>
      ))}
    </section>
  )
}
