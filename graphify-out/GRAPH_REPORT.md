# Graph Report - portfolio  (2026-11-23)

## Corpus Check
- 180 files · ~157,073 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: .css 2, .example 1, (none) 1)

## Summary
- 738 nodes · 1440 edges · 57 communities (27 shown, 30 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d3b579c5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- (frontend)/page.tsx
- ContactForm.tsx
- dashboard/page.tsx
- payload-types.ts
- marketing/page.tsx
- steps
- payload.config.ts
- (frontend)/layout.tsx
- compilerOptions
- dependencies
- @payloadcms/next
- 20261002_141521_formulario_contato.ts
- devDependencies
- ProjectCard.tsx
- components.json
- [slug]/page.tsx
- scripts
- db
- package.json
- LikeButton.tsx
- admin.e2e.spec.ts
- allowBuilds
- 20261002_141521_formulario_contato.ts
- Portfólio · Guilherme Mitter
- dotenv
- DemoCarousel.tsx
- @payloadcms/storage-vercel-blob
- Badge
- vite-tsconfig-paths
- .prettierrc.json
- eslint-config-next
- engines
- @payloadcms/db-postgres
- cross-env@^7.0.3
- @payloadcms/email-resend
- index.ts
- AGENTS.md
- @payloadcms/translations
- tailwind-merge
- postcss.config.mjs
- vercel.json

## God Nodes (most connected - your core abstractions)
1. `payload` - 37 edges
2. `next` - 33 edges
3. `react` - 24 edges
4. `@payloadcms/db-postgres` - 24 edges
5. `vitest` - 21 edges
6. `MarketingPage()` - 20 edges
7. `Button()` - 19 edges
8. `DashboardPage()` - 18 edges
9. `compilerOptions` - 17 edges
10. `HomePage()` - 15 edges

## Surprising Connections (you probably didn't know these)
- `MarketingPage()` --calls--> `LineChart()`  [EXTRACTED]
  src/app/(frontend)/marketing/page.tsx → src/components/LineChart.tsx
- `MarketingPage()` --calls--> `Card()`  [EXTRACTED]
  src/app/(frontend)/marketing/page.tsx → src/components/ui/card.tsx
- `MarketingPage()` --calls--> `dayKey()`  [EXTRACTED]
  src/app/(frontend)/marketing/page.tsx → src/lib/dashboard.ts
- `matchEvent()` --calls--> `dayKey()`  [EXTRACTED]
  src/lib/instagramStats.ts → src/lib/dashboard.ts
- `wasPosted()` --calls--> `dayKey()`  [EXTRACTED]
  src/lib/instagramStats.ts → src/lib/dashboard.ts

## Import Cycles
- None detected.

## Communities (57 total, 30 thin omitted)

### Community 0 - "(frontend)/page.tsx"
Cohesion: 0.07
Nodes (41): next, metadata, NotFound(), DEMOS, dynamic, HomePage(), metadata, Props (+33 more)

### Community 1 - "ContactForm.tsx"
Cohesion: 0.11
Nodes (28): class-variance-authority, @radix-ui/react-slot, react, ContactState, sendMessage(), ContactForm(), initialState, ContactSection() (+20 more)

### Community 2 - "dashboard/page.tsx"
Cohesion: 0.13
Nodes (29): DashboardPage(), dynamic, metadata, AutoRefresh(), LineChart(), PAD, WorldMap(), dayKey() (+21 more)

### Community 3 - "payload-types.ts"
Cohesion: 0.05
Nodes (42): Auth, Campaign, CampaignsSelect, CollectionsWidget, Config, GeneratedTypes, InstagramConexao, InstagramConexaoSelect (+34 more)

### Community 4 - "marketing/page.tsx"
Cohesion: 0.06
Nodes (61): @vercel/blob@2.3.1, @vercel/blob, anchor(), COLS, dynamic, fmt(), MarketingPage(), metadata (+53 more)

### Community 5 - "steps"
Cohesion: 0.07
Nodes (28): env, runs-on, services, steps, DATABASE_URL, PAYLOAD_SECRET, POSTGRES_DB, POSTGRES_PASSWORD (+20 more)

### Community 6 - "payload.config.ts"
Cohesion: 0.05
Nodes (47): dirname, __filename, nextConfig, payload, publishedOrLoggedIn(), POST(), countView(), Campaigns (+39 more)

### Community 7 - "(frontend)/layout.tsx"
Cohesion: 0.12
Nodes (11): body, display, dynamic, metadata, mono, RootLayout(), viewport, dynamic (+3 more)

### Community 8 - "compilerOptions"
Cohesion: 0.10
Nodes (20): compilerOptions, allowJs, baseUrl, esModuleInterop, incremental, isolatedModules, jsx, lib (+12 more)

### Community 9 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, class-variance-authority@^0.7.1, graphql@^16.8.1, next@16.3.8, payload@3.90.2, @payloadcms/richtext-lexical@3.90.2, @payloadcms/ui@3.90.2, @radix-ui/react-slot@^1.5.0 (+12 more)

### Community 10 - "@payloadcms/next"
Cohesion: 0.08
Nodes (15): @payloadcms/next@3.90.2, @payloadcms/next, importMap, Args, Args, GET, OPTIONS, POST (+7 more)

### Community 12 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, eslint@^9.16.0, jsdom@28.0.0, prettier@^3.4.2, tsx@4.23.15, @types/node@22.19.9, @types/react@19.2.14, @types/react-dom@19.2.3 (+9 more)

### Community 13 - "ProjectCard.tsx"
Cohesion: 0.30
Nodes (9): Filter, FILTERS, PostCover(), Props, PostTile(), ProjectCard(), CATEGORY_LABELS, STATUS_LABELS (+1 more)

### Community 14 - "components.json"
Cohesion: 0.13
Nodes (14): aliases, components, ui, utils, iconLibrary, rsc, $schema, style (+6 more)

### Community 15 - "[slug]/page.tsx"
Cohesion: 0.21
Nodes (11): dynamic, generateMetadata(), getProject, ProjectPage(), Props, Gallery(), Props, ICONS (+3 more)

### Community 16 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, dev, devsafe, generate:importmap, generate:types, lint, payload (+6 more)

### Community 17 - "db"
Cohesion: 0.15
Nodes (12): environment, image, ports, restart, volumes, POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_USER (+4 more)

### Community 18 - "package.json"
Cohesion: 0.15
Nodes (12): clsx@^2.1.1, postcss@^8.5.31, tailwindcss@^4.3.3, description, license, name, private, type (+4 more)

### Community 19 - "LikeButton.tsx"
Cohesion: 0.31
Nodes (9): LikeState, toggleLike(), LikeButton(), handleClick(), openInvite(), Props, isVisitorId(), likesLabel() (+1 more)

### Community 20 - "admin.e2e.spec.ts"
Cohesion: 0.27
Nodes (7): @playwright/test@1.58.2, @playwright/test, login(), LoginOptions, cleanupTestUser(), seedTestUser(), testUser

### Community 21 - "allowBuilds"
Cohesion: 0.20
Nodes (9): allowBuilds, esbuild, sharp, unrs-resolver, workerd, minimumReleaseAge, overrides, dompurify (+1 more)

### Community 24 - "Portfólio · Guilherme Mitter"
Cohesion: 0.25
Nodes (7): Como funciona, Estrutura do código, O que o site faz, Portfólio · Guilherme Mitter, Qualidade e segurança, Sobre, Tecnologias

### Community 28 - "DemoCarousel.tsx"
Cohesion: 0.14
Nodes (10): @testing-library/react@16.3.0, @testing-library/react, DemoCarousel(), Slide, DemoVideo(), useMedia(), IntroDemo(), SLIDES (+2 more)

### Community 31 - "vite-tsconfig-paths"
Cohesion: 0.29
Nodes (6): vite-tsconfig-paths@6.0.5, @vitejs/plugin-react@4.5.2, vitest@4.0.18, vite-tsconfig-paths, @vitejs/plugin-react, vitest

### Community 32 - ".prettierrc.json"
Cohesion: 0.40
Nodes (4): printWidth, semi, singleQuote, trailingComma

### Community 33 - "eslint-config-next"
Cohesion: 0.50
Nodes (3): eslintConfig, eslint-config-next@16.3.8, eslint-config-next

### Community 36 - "engines"
Cohesion: 0.67
Nodes (3): engines, node, pnpm

## Knowledge Gaps
- **30 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `(frontend)/page.tsx` to `dashboard/page.tsx`, `marketing/page.tsx`, `payload.config.ts`, `(frontend)/layout.tsx`, `dependencies`, `@payloadcms/next`, `ProjectCard.tsx`, `[slug]/page.tsx`, `package.json`, `LikeButton.tsx`, `DemoCarousel.tsx`?**
  _High betweenness centrality (0.116) - this node is a cross-community bridge._
- **Should `(frontend)/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06994047619047619 - nodes in this community are weakly interconnected._
- **Why does `payload` connect `payload.config.ts` to `(frontend)/page.tsx`, `ContactForm.tsx`, `dashboard/page.tsx`, `marketing/page.tsx`, `(frontend)/layout.tsx`, `dependencies`, `@payloadcms/next`, `20261002_140150_ordem_feed.ts`, `[slug]/page.tsx`, `package.json`, `LikeButton.tsx`, `admin.e2e.spec.ts`?**
  _High betweenness centrality (0.109) - this node is a cross-community bridge._
- **Should `ContactForm.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10609756097560975 - nodes in this community are weakly interconnected._
- **Why does `@payloadcms/db-postgres` connect `@payloadcms/db-postgres` to `20261002_154200_recomendacoes.ts`, `20261002_165054_visualizacoes.ts`, `20261123_171340_instagram_capa.ts`, `payload.config.ts`, `20261002_134058_contato_whatsapp.ts`, `20261002_140150_ordem_feed.ts`, `20261002_150425_instagram.ts`, `20261002_141521_formulario_contato.ts`, `20261020_013314_dashboard_visualizacoes_por_dia.ts`, `20261020_015111_dashboard_origem_das_visitas.ts`, `20261024_151913_dashboard_mapa_das_visitas.ts`, `20261024_173800_texto_de_apoio.ts`, `index.ts`, `package.json`, `20261002_141521_formulario_contato.ts`, `20261002_162615_curtidas.ts`, `20261025_155904_videos_de_demonstracao.ts`, `20261001_161241_imagens_vercel_blob.ts`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **Should `dashboard/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12802275960170698 - nodes in this community are weakly interconnected._
- **Should `payload-types.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.047619047619047616 - nodes in this community are weakly interconnected._