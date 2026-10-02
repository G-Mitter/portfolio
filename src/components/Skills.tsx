import { splitItems } from '@/lib/skills'
import type { Profile } from '@/payload-types'

/**
 * Lista de tecnologias por grupo, cadastrada em /admin > Perfil > Tecnologias.
 * Fica logo depois do feed: o recrutador vê os projetos e, em seguida,
 * tudo com que você já trabalhou num lugar só.
 * Usa <dl> (lista de definições): cada <dt> é o nome do grupo e o <dd>, os itens.
 */
export function Skills({ skills }: { skills: Profile['skills'] }) {
  if (!skills?.length) return null

  return (
    <section className="skills" aria-labelledby="tecnologias-titulo">
      <h2 id="tecnologias-titulo">Tecnologias</h2>
      <p>Com o que já trabalhei nos projetos e no dia a dia.</p>
      <dl>
        {skills.map((skill) => (
          <div key={skill.id ?? skill.group}>
            <dt>{skill.group}</dt>
            <dd className="chips">
              {splitItems(skill.items).map((item) => (
                <span className="chip" key={item}>
                  {item}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
