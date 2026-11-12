# Graph Report - portfolio  (2026-11-12)

## Corpus Check
- 167 files · ~134,856 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: .css 2, .example 1, (none) 1)

## Summary
- 671 nodes · 1294 edges · 57 communities (31 shown, 26 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `829a7098`
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
- lib/views.ts
- compilerOptions
- dependencies
- @payloadcms/next
- (frontend)/layout.tsx
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
- @payloadcms/db-postgres
- Portfólio · Guilherme Mitter
- dotenv
- seed.ts
- index.ts
- sitemap.ts
- (frontend)/views.ts
- source.ts
- vite-tsconfig-paths
- .prettierrc.json
- eslint-config-next
- @payloadcms/richtext-lexical
- 20261002_144740_como_eu_trabalho.ts
- engines
- sharp
- AGENTS.md
- @payloadcms/storage-vercel-blob
- postcss@^8.5.31
- tailwind-merge
- tailwindcss@^4.3.3
- postcss.config.mjs
- vercel.json

## God Nodes (most connected - your core abstractions)
1. `payload` - 34 edges
2. `next` - 31 edges
3. `@payloadcms/db-postgres` - 22 edges
4. `react` - 21 edges
5. `Button()` - 19 edges
6. `DashboardPage()` - 18 edges
7. `vitest` - 18 edges
8. `HomePage()` - 17 edges
9. `compilerOptions` - 17 edges
10. `scripts` - 14 edges

## Surprising Connections (you probably didn't know these)
- `RootLayout()` --calls--> `SiteHeader()`  [EXTRACTED]
  src/app/(frontend)/layout.tsx → src/components/SiteHeader.tsx
- `NotFound()` --calls--> `Button()`  [EXTRACTED]
  src/app/(frontend)/not-found.tsx → src/components/ui/button.tsx
- `HomePage()` --calls--> `ContactSection()`  [EXTRACTED]
  src/app/(frontend)/page.tsx → src/components/ContactSection.tsx
- `HomePage()` --calls--> `DemoVideo()`  [EXTRACTED]
  src/app/(frontend)/page.tsx → src/components/DemoVideo.tsx
- `HomePage()` --calls--> `ProjectCard()`  [EXTRACTED]
  src/app/(frontend)/page.tsx → src/components/ProjectCard.tsx

## Import Cycles
- None detected.

## Communities (57 total, 26 thin omitted)

### Community 0 - "(frontend)/page.tsx"
Cohesion: 0.06
Nodes (48): next, metadata, NotFound(), DEMOS, dynamic, HomePage(), metadata, Props (+40 more)

### Community 1 - "react"
Cohesion: 0.11
Nodes (25): react, ContactState, sendMessage(), ContactForm(), initialState, ContactSection(), Props, HIGHLIGHTS (+17 more)

### Community 2 - "dashboard/page.tsx"
Cohesion: 0.13
Nodes (29): DashboardPage(), dynamic, metadata, AutoRefresh(), LineChart(), PAD, WorldMap(), dayKey() (+21 more)

### Community 3 - "payload-types.ts"
Cohesion: 0.06
Nodes (36): Auth, CollectionsWidget, Config, GeneratedTypes, Like, LikesSelect, MarketingFile, MarketingFilesSelect (+28 more)

### Community 4 - "marketing/page.tsx"
Cohesion: 0.12
Nodes (31): @vercel/blob@2.3.1, @vercel/blob, anchor(), dynamic, MarketingPage(), metadata, postKey(), WEEKDAYS (+23 more)

### Community 5 - "steps"
Cohesion: 0.07
Nodes (28): env, runs-on, services, steps, DATABASE_URL, PAYLOAD_SECRET, POSTGRES_DB, POSTGRES_PASSWORD (+20 more)

### Community 6 - "payload.config.ts"
Cohesion: 0.15
Nodes (12): dirname, __filename, nextConfig, payload, Likes, Media, PageViewDays, PageViewPlaces (+4 more)

### Community 7 - "lib/views.ts"
Cohesion: 0.24
Nodes (11): POST(), PageViewTimes, matchPage(), Bucket, BUCKET_LABELS, bucketFor(), BUCKETS, MAX_SECONDS (+3 more)

### Community 8 - "compilerOptions"
Cohesion: 0.10
Nodes (20): compilerOptions, allowJs, baseUrl, esModuleInterop, incremental, isolatedModules, jsx, lib (+12 more)

### Community 9 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, class-variance-authority@^0.7.1, clsx@^2.1.1, graphql@^16.8.1, next@16.3.8, payload@3.90.2, @payloadcms/email-resend@3.90.2, @payloadcms/ui@3.90.2 (+12 more)

### Community 10 - "@payloadcms/next"
Cohesion: 0.08
Nodes (15): @payloadcms/next@3.90.2, @payloadcms/next, importMap, Args, Args, GET, OPTIONS, POST (+7 more)

### Community 11 - "(frontend)/layout.tsx"
Cohesion: 0.20
Nodes (8): body, display, dynamic, metadata, mono, RootLayout(), viewport, Footer()

### Community 12 - "devDependencies"
Cohesion: 0.11
Nodes (19): devDependencies, eslint@^9.16.0, jsdom@28.0.0, prettier@^3.4.2, @testing-library/react@16.3.0, tsx@4.23.15, @types/node@22.19.9, @types/react@19.2.14 (+11 more)

### Community 13 - "ProjectCard.tsx"
Cohesion: 0.31
Nodes (8): Filter, FILTERS, Props, PostTile(), ProjectCard(), CATEGORY_LABELS, STATUS_LABELS, Project

### Community 14 - "components.json"
Cohesion: 0.13
Nodes (14): aliases, components, ui, utils, iconLibrary, rsc, $schema, style (+6 more)

### Community 15 - "[slug]/page.tsx"
Cohesion: 0.20
Nodes (11): dynamic, generateMetadata(), getProject, ProjectPage(), Props, DemoVideo(), useMedia(), Gallery() (+3 more)

### Community 16 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, dev, devsafe, generate:importmap, generate:types, lint, payload (+6 more)

### Community 17 - "db"
Cohesion: 0.15
Nodes (12): environment, image, ports, restart, volumes, POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_USER (+4 more)

### Community 18 - "package.json"
Cohesion: 0.15
Nodes (12): cross-env@^7.0.3, @payloadcms/translations@3.90.2, @tailwindcss/postcss@^4.3.3, description, license, name, private, type (+4 more)

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

### Community 26 - "seed.ts"
Cohesion: 0.15
Nodes (13): vitest@4.0.18, vitest, publishedOrLoggedIn(), Projects, Profile, isHttpUrl(), validateHttpUrl(), instagramUrl() (+5 more)

### Community 28 - "sitemap.ts"
Cohesion: 0.31
Nodes (3): dynamic, Messages, siteUrl

### Community 29 - "(frontend)/views.ts"
Cohesion: 0.36
Nodes (6): countView(), ViewCounter(), addPlace(), addSource(), addView(), createdIds

### Community 30 - "source.ts"
Cohesion: 0.28
Nodes (6): PageViewSources, classifySource(), HOSTS, Source, SOURCE_LABELS, SOURCES

### Community 31 - "vite-tsconfig-paths"
Cohesion: 0.40
Nodes (4): vite-tsconfig-paths@6.0.5, @vitejs/plugin-react@4.5.2, vite-tsconfig-paths, @vitejs/plugin-react

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
- **26 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `(frontend)/page.tsx` to `dashboard/page.tsx`, `marketing/page.tsx`, `payload.config.ts`, `lib/views.ts`, `dependencies`, `@payloadcms/next`, `(frontend)/layout.tsx`, `ProjectCard.tsx`, `[slug]/page.tsx`, `package.json`, `LikeButton.tsx`, `sitemap.ts`, `(frontend)/views.ts`?**
  _High betweenness centrality (0.118) - this node is a cross-community bridge._
- **Should `(frontend)/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06293965198074787 - nodes in this community are weakly interconnected._
- **Why does `payload` connect `payload.config.ts` to `(frontend)/page.tsx`, `react`, `dashboard/page.tsx`, `marketing/page.tsx`, `lib/views.ts`, `dependencies`, `@payloadcms/next`, `(frontend)/layout.tsx`, `20261002_140150_ordem_feed.ts`, `[slug]/page.tsx`, `package.json`, `LikeButton.tsx`, `admin.e2e.spec.ts`, `seed.ts`, `sitemap.ts`, `(frontend)/views.ts`, `source.ts`?**
  _High betweenness centrality (0.105) - this node is a cross-community bridge._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.11261261261261261 - nodes in this community are weakly interconnected._
- **Why does `@payloadcms/db-postgres` connect `@payloadcms/db-postgres` to `20261002_144740_como_eu_trabalho.ts`, `20260930_235140_initial.ts`, `20261001_161241_imagens_vercel_blob.ts`, `20261002_134058_contato_whatsapp.ts`, `lib/views.ts`, `20261002_140150_ordem_feed.ts`, `20261002_150425_instagram.ts`, `20261020_013314_dashboard_visualizacoes_por_dia.ts`, `20261020_015111_dashboard_origem_das_visitas.ts`, `20261024_151913_dashboard_mapa_das_visitas.ts`, `20261024_152828_dashboard_tempo_na_pagina.ts`, `20261024_173800_texto_de_apoio.ts`, `20261031_165422_materiais_marketing.ts`, `package.json`, `20261002_141521_formulario_contato.ts`, `index.ts`, `payload.config.ts`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._
- **Should `dashboard/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12802275960170698 - nodes in this community are weakly interconnected._
- **Should `payload-types.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05555555555555555 - nodes in this community are weakly interconnected._