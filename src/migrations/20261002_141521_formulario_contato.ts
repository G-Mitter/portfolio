import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import { randomBytes } from 'crypto'

// Textos iniciais de "Como posso ajudar". Depois você muda em /admin > Perfil.
const SERVICES = [
  {
    title: 'Automatizar tarefas repetitivas',
    description:
      'Robôs (RPA) e scripts que fazem sozinhos o trabalho manual de todo dia: cargas em sistemas, cópias entre planilhas e conferências.',
  },
  {
    title: 'Sistemas sob medida',
    description:
      'Aplicações web simples para organizar processos que hoje vivem em planilhas, e-mails ou papel.',
  },
  {
    title: 'Dados e relatórios',
    description:
      'Regras e painéis que juntam as informações do negócio em uma tela, para decidir sem montar relatório na mão.',
  },
]

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "messages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"contact" varchar NOT NULL,
  	"problem" varchar NOT NULL,
  	"source" varchar,
  	"answered" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "profile_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "messages_id" integer;
  ALTER TABLE "profile" ADD COLUMN "available" boolean DEFAULT true;
  ALTER TABLE "profile_services" ADD CONSTRAINT "profile_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "messages_updated_at_idx" ON "messages" USING btree ("updated_at");
  CREATE INDEX "messages_created_at_idx" ON "messages" USING btree ("created_at");
  CREATE INDEX "profile_services_order_idx" ON "profile_services" USING btree ("_order");
  CREATE INDEX "profile_services_parent_id_idx" ON "profile_services" USING btree ("_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_messages_fk" FOREIGN KEY ("messages_id") REFERENCES "public"."messages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_messages_id_idx" ON "payload_locked_documents_rels" USING btree ("messages_id");`)

  // A tabela acabou de ser criada (vazia). Se o perfil já existe, entra com os textos iniciais.
  const { rows } = await db.execute(sql`SELECT "id" FROM "profile" LIMIT 1`)
  const profileId = rows[0]?.id
  if (profileId === undefined) return
  for (const [order, service] of SERVICES.entries()) {
    // O Payload guarda o id de cada item da lista como texto (24 caracteres hexadecimais).
    await db.execute(sql`
      INSERT INTO "profile_services" ("_order", "_parent_id", "id", "title", "description")
      VALUES (${order + 1}, ${profileId}, ${randomBytes(12).toString('hex')}, ${service.title}, ${service.description})`)
  }
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "messages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "profile_services" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "messages" CASCADE;
  DROP TABLE "profile_services" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_messages_fk";
  
  DROP INDEX "payload_locked_documents_rels_messages_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "messages_id";
  ALTER TABLE "profile" DROP COLUMN "available";`)
}
