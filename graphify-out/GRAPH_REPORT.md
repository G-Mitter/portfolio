# Graph Report - portfolio  (2026-11-23)

## Corpus Check
- 181 files · ~157,393 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: .css 2, .example 1, (none) 1)

## Summary
- 742 nodes · 1447 edges · 57 communities (28 shown, 29 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b2224d02`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- (frontend)/page.tsx
- react
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
- introDemo.int.spec.ts
- DemoCarousel.tsx
- cross-env@^7.0.3
- Badge
- vite-tsconfig-paths
- .prettierrc.json
- eslint-config-next
- @payloadcms/email-resend
- @payloadcms/db-postgres
- simple-icons
- react-dom@19.2.6
- index.ts
- AGENTS.md
- tailwind-merge
- @vercel/blob
- postcss.config.mjs
- vercel.json

## God Nodes (most connected - your core abstractions)
1. `payload` - 37 edges
2. `next` - 33 edges
3. `react` - 24 edges
4. `@payloadcms/db-postgres` - 24 edges
5. `MarketingPage()` - 21 edges
6. `vitest` - 21 edges
7. `Button()` - 19 edges
8. `DashboardPage()` - 18 edges
9. `compilerOptions` - 17 edges
10. `HomePage()` - 16 edges

## Surprising Connections (you probably didn't know these)
- `HomePage()` --calls--> `ContactSection()`  [EXTRACTED]
  src/app/(frontend)/page.tsx → src/components/ContactSection.tsx
- `HomePage()` --calls--> `DemoCarousel()`  [EXTRACTED]
  src/app/(frontend)/page.tsx → src/components/DemoCarousel.tsx
- `ContactForm()` --indirect_call--> `sendMessage()`  [INFERRED]
  src/components/ContactForm.tsx → src/app/(frontend)/actions.ts
- `NotFound()` --calls--> `Button()`  [EXTRACTED]
  src/app/(frontend)/not-found.tsx → src/components/ui/button.tsx
- `PortfolioPage()` --calls--> `Feed()`  [EXTRACTED]
  src/app/(frontend)/portfolio/page.tsx → src/components/Feed.tsx

## Import Cycles
- None detected.

## Communities (57 total, 29 thin omitted)

### Community 0 - "(frontend)/page.tsx"
Cohesion: 0.07
Nodes (43): next, metadata, NotFound(), DEMOS, dynamic, HomePage(), metadata, Props (+35 more)

### Community 1 - "react"
Cohesion: 0.11
Nodes (28): class-variance-authority, @radix-ui/react-slot, react, ContactState, sendMessage(), ContactForm(), initialState, ContactSection() (+20 more)

### Community 2 - "dashboard/page.tsx"
Cohesion: 0.13
Nodes (28): DashboardPage(), dynamic, metadata, AutoRefresh(), LineChart(), PAD, WorldMap(), dayKey() (+20 more)

### Community 3 - "payload-types.ts"
Cohesion: 0.05
Nodes (42): Auth, Campaign, CampaignsSelect, CollectionsWidget, Config, GeneratedTypes, InstagramConexao, InstagramConexaoSelect (+34 more)

### Community 4 - "marketing/page.tsx"
Cohesion: 0.07
Nodes (60): anchor(), COLS, dynamic, fmt(), MarketingPage(), metadata, metricLine(), postKey() (+52 more)

### Community 5 - "steps"
Cohesion: 0.07
Nodes (28): env, runs-on, services, steps, DATABASE_URL, PAYLOAD_SECRET, POSTGRES_DB, POSTGRES_PASSWORD (+20 more)

### Community 6 - "payload.config.ts"
Cohesion: 0.05
Nodes (48): dirname, __filename, nextConfig, payload, publishedOrLoggedIn(), POST(), countView(), Campaigns (+40 more)

### Community 7 - "(frontend)/layout.tsx"
Cohesion: 0.12
Nodes (11): body, display, dynamic, metadata, mono, RootLayout(), viewport, dynamic (+3 more)

### Community 8 - "compilerOptions"
Cohesion: 0.10
Nodes (20): compilerOptions, allowJs, baseUrl, esModuleInterop, incremental, isolatedModules, jsx, lib (+12 more)

### Community 9 - "dependencies"
Cohesion: 0.08
Nodes (22): dependencies, class-variance-authority@^0.7.1, clsx@^2.1.1, dotenv@16.4.7, graphql@^16.8.1, next@16.3.8, payload@3.90.2, @payloadcms/richtext-lexical@3.90.2 (+14 more)

### Community 10 - "@payloadcms/next"
Cohesion: 0.08
Nodes (15): @payloadcms/next@3.90.2, @payloadcms/next, importMap, Args, Args, GET, OPTIONS, POST (+7 more)

### Community 12 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, eslint@^9.16.0, jsdom@28.0.0, prettier@^3.4.2, tsx@4.23.15, @types/node@22.19.9, @types/react@19.2.14, @types/react-dom@19.2.3 (+9 more)

### Community 13 - "ProjectCard.tsx"
Cohesion: 0.28
Nodes (10): Feed(), Filter, FILTERS, PostCover(), Props, PostTile(), ProjectCard(), CATEGORY_LABELS (+2 more)

### Community 14 - "components.json"
Cohesion: 0.13
Nodes (14): aliases, components, ui, utils, iconLibrary, rsc, $schema, style (+6 more)

### Community 15 - "[slug]/page.tsx"
Cohesion: 0.24
Nodes (8): dynamic, generateMetadata(), getProject, ProjectPage(), Props, Gallery(), Props, Media

### Community 16 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, dev, devsafe, generate:importmap, generate:types, lint, payload (+6 more)

### Community 17 - "db"
Cohesion: 0.15
Nodes (12): environment, image, ports, restart, volumes, POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_USER (+4 more)

### Community 18 - "package.json"
Cohesion: 0.12
Nodes (15): @payloadcms/ui@3.90.2, sharp@0.35.4, tailwindcss@^4.3.3, description, engines, node, pnpm, license (+7 more)

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

### Community 25 - "introDemo.int.spec.ts"
Cohesion: 0.28
Nodes (5): @testing-library/react@16.3.0, @testing-library/react, IntroDemo(), SLIDES, useReducedMotion()

### Community 28 - "DemoCarousel.tsx"
Cohesion: 0.29
Nodes (5): DemoCarousel(), Slide, DemoVideo(), useMedia(), slides

### Community 30 - "Badge"
Cohesion: 0.43
Nodes (4): Skills(), ICONS, TechBadge(), splitItems()

### Community 31 - "vite-tsconfig-paths"
Cohesion: 0.29
Nodes (6): vite-tsconfig-paths@6.0.5, @vitejs/plugin-react@4.5.2, vitest@4.0.18, vite-tsconfig-paths, @vitejs/plugin-react, vitest

### Community 32 - ".prettierrc.json"
Cohesion: 0.40
Nodes (4): printWidth, semi, singleQuote, trailingComma

### Community 33 - "eslint-config-next"
Cohesion: 0.50
Nodes (3): eslintConfig, eslint-config-next@16.3.8, eslint-config-next

## Knowledge Gaps
- **29 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `(frontend)/page.tsx` to `dashboard/page.tsx`, `marketing/page.tsx`, `payload.config.ts`, `(frontend)/layout.tsx`, `dependencies`, `@payloadcms/next`, `ProjectCard.tsx`, `[slug]/page.tsx`, `package.json`, `LikeButton.tsx`, `DemoCarousel.tsx`?**
  _High betweenness centrality (0.117) - this node is a cross-community bridge._
- **Should `(frontend)/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06693803708729082 - nodes in this community are weakly interconnected._
- **Why does `payload` connect `payload.config.ts` to `(frontend)/page.tsx`, `react`, `dashboard/page.tsx`, `marketing/page.tsx`, `(frontend)/layout.tsx`, `dependencies`, `@payloadcms/next`, `20261002_140150_ordem_feed.ts`, `[slug]/page.tsx`, `package.json`, `LikeButton.tsx`, `admin.e2e.spec.ts`?**
  _High betweenness centrality (0.110) - this node is a cross-community bridge._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.10609756097560975 - nodes in this community are weakly interconnected._
- **Why does `@payloadcms/db-postgres` connect `@payloadcms/db-postgres` to `20261002_154200_recomendacoes.ts`, `20261002_165054_visualizacoes.ts`, `20261123_171340_instagram_capa.ts`, `payload.config.ts`, `20261002_134058_contato_whatsapp.ts`, `20261002_140150_ordem_feed.ts`, `20261002_150425_instagram.ts`, `20261002_141521_formulario_contato.ts`, `20261020_013314_dashboard_visualizacoes_por_dia.ts`, `20261020_015111_dashboard_origem_das_visitas.ts`, `20261024_151913_dashboard_mapa_das_visitas.ts`, `20261024_173800_texto_de_apoio.ts`, `index.ts`, `package.json`, `20261002_141521_formulario_contato.ts`, `20261002_162615_curtidas.ts`, `20261025_155904_videos_de_demonstracao.ts`, `20261001_161241_imagens_vercel_blob.ts`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._
- **Should `dashboard/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13213213213213212 - nodes in this community are weakly interconnected._
- **Should `payload-types.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.047619047619047616 - nodes in this community are weakly interconnected._