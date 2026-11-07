import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_campaigns_status" AS ENUM('planejada', 'ativa', 'encerrada');
  CREATE TYPE "public"."enum_instagram_posts_tipo" AS ENUM('reels', 'carrossel', 'foto', 'video', 'story');
  CREATE TABLE "campaigns" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nome" varchar NOT NULL,
  	"codigo" varchar NOT NULL,
  	"objetivo" varchar,
  	"inicio" timestamp(3) with time zone,
  	"fim" timestamp(3) with time zone,
  	"orcamento" numeric,
  	"status" "enum_campaigns_status" DEFAULT 'ativa',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "instagram_posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"ig_id" varchar NOT NULL,
  	"tipo" "enum_instagram_posts_tipo" NOT NULL,
  	"publicado_em" timestamp(3) with time zone NOT NULL,
  	"link" varchar,
  	"legenda" varchar,
  	"campanha_id" integer,
  	"alcance" numeric DEFAULT 0,
  	"visualizacoes" numeric DEFAULT 0,
  	"curtidas" numeric DEFAULT 0,
  	"comentarios" numeric DEFAULT 0,
  	"salvamentos" numeric DEFAULT 0,
  	"compartilhamentos" numeric DEFAULT 0,
  	"respostas" numeric DEFAULT 0,
  	"interacoes" numeric DEFAULT 0,
  	"atualizado_em" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "instagram_conexao" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"token" varchar,
  	"token_do_env" varchar,
  	"renovado_em" timestamp(3) with time zone,
  	"ultima_sincronizacao" timestamp(3) with time zone,
  	"ultimo_erro" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "campaigns_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "instagram_posts_id" integer;
  ALTER TABLE "instagram_posts" ADD CONSTRAINT "instagram_posts_campanha_id_campaigns_id_fk" FOREIGN KEY ("campanha_id") REFERENCES "public"."campaigns"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "campaigns_codigo_idx" ON "campaigns" USING btree ("codigo");
  CREATE INDEX "campaigns_updated_at_idx" ON "campaigns" USING btree ("updated_at");
  CREATE INDEX "campaigns_created_at_idx" ON "campaigns" USING btree ("created_at");
  CREATE UNIQUE INDEX "instagram_posts_ig_id_idx" ON "instagram_posts" USING btree ("ig_id");
  CREATE INDEX "instagram_posts_publicado_em_idx" ON "instagram_posts" USING btree ("publicado_em");
  CREATE INDEX "instagram_posts_campanha_idx" ON "instagram_posts" USING btree ("campanha_id");
  CREATE INDEX "instagram_posts_updated_at_idx" ON "instagram_posts" USING btree ("updated_at");
  CREATE INDEX "instagram_posts_created_at_idx" ON "instagram_posts" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_campaigns_fk" FOREIGN KEY ("campaigns_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_instagram_posts_fk" FOREIGN KEY ("instagram_posts_id") REFERENCES "public"."instagram_posts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_campaigns_id_idx" ON "payload_locked_documents_rels" USING btree ("campaigns_id");
  CREATE INDEX "payload_locked_documents_rels_instagram_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("instagram_posts_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "campaigns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "instagram_posts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "instagram_conexao" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "campaigns" CASCADE;
  DROP TABLE "instagram_posts" CASCADE;
  DROP TABLE "instagram_conexao" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_campaigns_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_instagram_posts_fk";
  
  DROP INDEX "payload_locked_documents_rels_campaigns_id_idx";
  DROP INDEX "payload_locked_documents_rels_instagram_posts_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "campaigns_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "instagram_posts_id";
  DROP TYPE "public"."enum_campaigns_status";
  DROP TYPE "public"."enum_instagram_posts_tipo";`)
}
