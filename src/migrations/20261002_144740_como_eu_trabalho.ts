import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import { randomBytes } from 'crypto'

// Etapas iniciais de "Como eu trabalho". Depois você muda em /admin > Perfil.
const STEPS = [
  {
    title: 'Conversa inicial',
    description:
      'Uma reunião rápida, online ou presencial, para entender o problema, quem vai usar e o que já foi tentado. Sem compromisso.',
  },
  {
    title: 'Levantamento de requisitos',
    description:
      'Mapeio o processo de hoje e defino com você, em linguagem simples, o que a solução precisa fazer e como vamos medir o resultado.',
  },
  {
    title: 'Protótipo',
    description:
      'Antes de construir tudo, envio um protótipo para você ver funcionando, opinar e pedir mudanças.',
  },
  {
    title: 'Desenvolvimento e ajustes',
    description:
      'Construo em etapas curtas e mostro o andamento a cada entrega, ajustando ao que a sua equipe realmente precisa.',
  },
  {
    title: 'Entrega e suporte',
    description:
      'Coloco no ar, treino quem vai usar e continuo dando suporte depois da entrega. Você fala comigo direto, sem intermediários.',
  },
]

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "profile_process" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  ALTER TABLE "profile_process" ADD CONSTRAINT "profile_process_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "profile_process_order_idx" ON "profile_process" USING btree ("_order");
  CREATE INDEX "profile_process_parent_id_idx" ON "profile_process" USING btree ("_parent_id");`)

  // A tabela acabou de ser criada (vazia). Se o perfil já existe, entra com as etapas iniciais.
  const { rows } = await db.execute(sql`SELECT "id" FROM "profile" LIMIT 1`)
  const profileId = rows[0]?.id
  if (profileId === undefined) return
  for (const [order, step] of STEPS.entries()) {
    // O Payload guarda o id de cada item da lista como texto (24 caracteres hexadecimais).
    await db.execute(sql`
      INSERT INTO "profile_process" ("_order", "_parent_id", "id", "title", "description")
      VALUES (${order + 1}, ${profileId}, ${randomBytes(12).toString('hex')}, ${step.title}, ${step.description})`)
  }
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "profile_process" CASCADE;`)
}
