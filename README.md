# Portfólio · Guilherme Mitter

Site de portfólio com feed de projetos no estilo Instagram. Cada projeto é um "post" cadastrado pelo painel `/admin` do próprio site.

**Stack:** [Next.js](https://nextjs.org) (site) + [Payload CMS](https://payloadcms.com) (painel admin e API) + PostgreSQL (banco).

## Como rodar no seu computador

Pré-requisitos: [Node.js 22](https://nodejs.org), [pnpm](https://pnpm.io/installation) e [Docker](https://www.docker.com/products/docker-desktop/) (só para o banco).

```bash
# 1. Instalar as dependências do projeto
pnpm install

# 2. Criar o arquivo de configuração local e preencher o PAYLOAD_SECRET
cp .env.example .env

# 3. Subir o banco Postgres num container
docker compose up -d db

# 4. (Opcional) Criar os 7 posts de exemplo
pnpm seed

# 5. Rodar o site em modo desenvolvimento
pnpm dev
```

Abra http://localhost:3000 para ver o feed e http://localhost:3000/admin para criar seu usuário e cadastrar posts.

## Scripts

| Comando | O que faz |
|---|---|
| `pnpm dev` | Roda o site com recarregamento automático |
| `pnpm seed` | Cria os posts de exemplo (pode rodar várias vezes) |
| `pnpm lint` | Verifica padrões de código |
| `pnpm typecheck` | Verifica os tipos do TypeScript |
| `pnpm test:int` | Roda os testes de integração (precisa do banco) |
| `pnpm build` | Gera a versão de produção |
| `pnpm generate:types` | Atualiza `src/payload-types.ts` depois de mudar uma coleção |

## Estrutura

```
src/
├── app/
│   ├── (frontend)/            # O site público
│   │   ├── page.tsx           # Feed (página inicial)
│   │   ├── projetos/[slug]/   # Página de detalhe de cada projeto
│   │   └── styles.css         # Visual (tokens de cor, grade, cards)
│   └── (payload)/             # Painel /admin e API, gerados pelo Payload (não editar)
├── collections/               # "Tabelas" do banco: Projects, Media, Users
├── globals/Profile.ts         # Documento único: bio, contadores e links do topo
├── access/                    # Regras de quem pode ler/editar o quê
├── components/                # Peças da interface (Feed, PostCover, ProfileHeader)
├── lib/                       # Funções utilitárias (slugify, textos das labels)
├── seed/seed.ts               # Script que cria os posts de exemplo
└── payload.config.ts          # Configuração central do Payload
```

## Como funciona (resumo)

1. Você cadastra um projeto em `/admin`. O Payload salva no Postgres.
2. A página inicial (`page.tsx`) roda **no servidor**, busca o perfil e os projetos direto do banco pela Local API do Payload e monta o HTML.
3. O componente `Feed` roda **no navegador** só para os filtros (Automação, Web...).
4. Clicar num post abre `/projetos/[slug]`, que busca aquele projeto pelo slug.
5. Rascunhos só aparecem para quem está logado no admin (`src/access/publishedOrLoggedIn.ts`).
