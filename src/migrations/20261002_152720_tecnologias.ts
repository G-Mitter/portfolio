import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import { randomBytes } from 'crypto'

// Lista inicial, tirada da seção "Habilidades técnicas" do seu currículo.
// Depois você muda em /admin > Perfil > Tecnologias.
const SKILLS = [
  { group: 'Linguagens', items: 'JavaScript, TypeScript, Python, Java, Rust, SQL, HTML, CSS' },
  { group: 'Frameworks', items: 'Next.js, Payload CMS, Spring Boot, Tauri, pandas' },
  { group: 'Banco de dados', items: 'PostgreSQL, MySQL' },
  {
    group: 'Automação',
    items: 'Power Automate Desktop (RPA), Google Apps Script, APIs REST, Webhooks',
  },
  { group: 'IA (APIs de LLM)', items: 'Groq, Gemini' },
  { group: 'Ferramentas', items: 'Git, GitHub, Vercel, Google Workspace' },
]

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "profile_skills" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"group" varchar NOT NULL,
  	"items" varchar NOT NULL
  );
  
  ALTER TABLE "profile_skills" ADD CONSTRAINT "profile_skills_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "profile_skills_order_idx" ON "profile_skills" USING btree ("_order");
  CREATE INDEX "profile_skills_parent_id_idx" ON "profile_skills" USING btree ("_parent_id");`)

  // A tabela acabou de ser criada (vazia). Se o perfil já existe, entra com a lista inicial.
  const { rows } = await db.execute(sql`SELECT "id" FROM "profile" LIMIT 1`)
  const profileId = rows[0]?.id
  if (profileId === undefined) return
  for (const [order, skill] of SKILLS.entries()) {
    // O Payload guarda o id de cada item da lista como texto (24 caracteres hexadecimais).
    await db.execute(sql`
      INSERT INTO "profile_skills" ("_order", "_parent_id", "id", "group", "items")
      VALUES (${order + 1}, ${profileId}, ${randomBytes(12).toString('hex')}, ${skill.group}, ${skill.items})`)
  }
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "profile_skills" CASCADE;`)
}
