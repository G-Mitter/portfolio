# Graph Report - portfolio  (2026-11-13)

## Corpus Check
- 170 files · ~135,934 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: .css 2, .example 1, (none) 1)

## Summary
- 684 nodes · 1316 edges · 63 communities (37 shown, 26 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `337b6ac9`
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
- vitest
- compilerOptions
- dependencies
- @payloadcms/next
- portfolio/page.tsx
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
- react
- index.ts
- DemoCarousel.tsx
- Projects.ts
- Badge
- vite-tsconfig-paths
- .prettierrc.json
- eslint-config-next
- Intro.tsx
- 20261002_144740_como_eu_trabalho.ts
- engines
- Button
- AGENTS.md
- seed.ts
- [...slug]/route.ts
- next.config.ts
- Testimonials.tsx
- graphql/route.ts
- clsx
- postcss.config.mjs
- vercel.json
- @tailwindcss/postcss@^4.3.3
- graphql-playground/route.ts

## God Nodes (most connected - your core abstractions)
1. `payload` - 34 edges
2. `next` - 32 edges
3. `react` - 24 edges
4. `@payloadcms/db-postgres` - 22 edges
5. `vitest` - 20 edges
6. `Button()` - 19 edges
7. `DashboardPage()` - 18 edges
8. `compilerOptions` - 17 edges
9. `HomePage()` - 16 edges
10. `scripts` - 14 edges

## Surprising Connections (you probably didn't know these)
- `ContactForm()` --indirect_call--> `sendMessage()`  [INFERRED]
  src/components/ContactForm.tsx → src/app/(frontend)/actions.ts
- `HomePage()` --calls--> `ContactSection()`  [EXTRACTED]
  src/app/(frontend)/page.tsx → src/components/ContactSection.tsx
- `HomePage()` --calls--> `DemoCarousel()`  [EXTRACTED]
  src/app/(frontend)/page.tsx → src/components/DemoCarousel.tsx
- `HomePage()` --calls--> `Intro()`  [EXTRACTED]
  src/app/(frontend)/page.tsx → src/components/Intro.tsx
- `HomePage()` --calls--> `Offer()`  [EXTRACTED]
  src/app/(frontend)/page.tsx → src/components/Offer.tsx

## Import Cycles
- None detected.

## Communities (63 total, 26 thin omitted)

### Community 0 - "(frontend)/page.tsx"
Cohesion: 0.13
Nodes (18): DEMOS, dynamic, HomePage(), metadata, Props, Faq(), QUESTIONS, Process() (+10 more)

### Community 1 - "ContactForm.tsx"
Cohesion: 0.13
Nodes (16): ContactState, sendMessage(), dynamic, Messages, initialState, CONTACT_LIMITS, ContactErrors, ContactInput (+8 more)

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
Cohesion: 0.19
Nodes (8): Likes, Media, PageViewDays, PageViewPlaces, PageViews, Users, dirname, filename

### Community 7 - "vitest"
Cohesion: 0.08
Nodes (33): payload, vitest, POST(), body, display, dynamic, metadata, mono (+25 more)

### Community 8 - "compilerOptions"
Cohesion: 0.10
Nodes (20): compilerOptions, allowJs, baseUrl, esModuleInterop, incremental, isolatedModules, jsx, lib (+12 more)

### Community 9 - "dependencies"
Cohesion: 0.08
Nodes (24): dependencies, cross-env@^7.0.3, graphql@^16.8.1, next@16.3.8, payload@3.90.2, @payloadcms/email-resend@3.90.2, @payloadcms/next@3.90.2, @payloadcms/richtext-lexical@3.90.2 (+16 more)

### Community 10 - "@payloadcms/next"
Cohesion: 0.16
Nodes (5): @payloadcms/next, importMap, Args, Args, Args

### Community 11 - "portfolio/page.tsx"
Cohesion: 0.22
Nodes (12): dynamic, metadata, PortfolioPage(), Feed(), ProfileHeader(), Props, LINKS, SiteHeader() (+4 more)

### Community 12 - "devDependencies"
Cohesion: 0.10
Nodes (20): devDependencies, eslint@^9.16.0, jsdom@28.0.0, prettier@^3.4.2, @testing-library/react@16.3.0, tsx@4.23.15, @types/node@22.19.9, @types/react@19.2.14 (+12 more)

### Community 13 - "ProjectCard.tsx"
Cohesion: 0.38
Nodes (7): Filter, FILTERS, PostTile(), ProjectCard(), CATEGORY_LABELS, STATUS_LABELS, Project

### Community 14 - "components.json"
Cohesion: 0.13
Nodes (14): aliases, components, ui, utils, iconLibrary, rsc, $schema, style (+6 more)

### Community 15 - "[slug]/page.tsx"
Cohesion: 0.17
Nodes (11): next, dynamic, generateMetadata(), getProject, ProjectPage(), Props, Gallery(), Props (+3 more)

### Community 16 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, dev, devsafe, generate:importmap, generate:types, lint, payload (+6 more)

### Community 17 - "db"
Cohesion: 0.15
Nodes (12): environment, image, ports, restart, volumes, POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_USER (+4 more)

### Community 18 - "package.json"
Cohesion: 0.12
Nodes (16): class-variance-authority@^0.7.1, @payloadcms/storage-vercel-blob@3.90.2, react-dom@19.2.6, simple-icons@^16.35.0, tailwind-merge@^3.7.0, description, license, name (+8 more)

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

### Community 26 - "react"
Cohesion: 0.23
Nodes (12): @radix-ui/react-slot, react, ContactForm(), ContactSection(), Props, BadgeProps, ButtonProps, Card() (+4 more)

### Community 28 - "DemoCarousel.tsx"
Cohesion: 0.29
Nodes (5): DemoCarousel(), Slide, DemoVideo(), useMedia(), slides

### Community 29 - "Projects.ts"
Cohesion: 0.33
Nodes (5): publishedOrLoggedIn(), Projects, Profile, isHttpUrl(), validateHttpUrl()

### Community 30 - "Badge"
Cohesion: 0.33
Nodes (6): Skills(), ICONS, TechBadge(), Badge(), badgeVariants, splitItems()

### Community 31 - "vite-tsconfig-paths"
Cohesion: 0.40
Nodes (4): vite-tsconfig-paths@6.0.5, @vitejs/plugin-react@4.5.2, vite-tsconfig-paths, @vitejs/plugin-react

### Community 32 - ".prettierrc.json"
Cohesion: 0.40
Nodes (4): printWidth, semi, singleQuote, trailingComma

### Community 33 - "eslint-config-next"
Cohesion: 0.50
Nodes (3): eslintConfig, eslint-config-next@16.3.8, eslint-config-next

### Community 34 - "Intro.tsx"
Cohesion: 0.33
Nodes (4): Intro(), IntroDemo(), SLIDES, useReducedMotion()

### Community 36 - "engines"
Cohesion: 0.67
Nodes (3): engines, node, pnpm

### Community 37 - "Button"
Cohesion: 0.32
Nodes (6): metadata, NotFound(), Offer(), TERMS, Button(), buttonVariants

### Community 50 - "seed.ts"
Cohesion: 0.39
Nodes (5): slugify(), paragraph(), projects, seed(), SeedProject

### Community 51 - "[...slug]/route.ts"
Cohesion: 0.29
Nodes (6): DELETE, GET, OPTIONS, PATCH, POST, PUT

### Community 52 - "next.config.ts"
Cohesion: 0.33
Nodes (3): dirname, __filename, nextConfig

### Community 53 - "Testimonials.tsx"
Cohesion: 0.60
Nodes (3): linkify(), Testimonials(), initials()

## Knowledge Gaps
- **26 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `[slug]/page.tsx` to `(frontend)/page.tsx`, `ContactForm.tsx`, `dashboard/page.tsx`, `Intro.tsx`, `marketing/page.tsx`, `Button`, `vitest`, `dependencies`, `@payloadcms/next`, `portfolio/page.tsx`, `ProjectCard.tsx`, `package.json`, `LikeButton.tsx`, `next.config.ts`, `Testimonials.tsx`, `DemoCarousel.tsx`?**
  _High betweenness centrality (0.119) - this node is a cross-community bridge._
- **Should `(frontend)/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12681159420289856 - nodes in this community are weakly interconnected._
- **Why does `payload` connect `vitest` to `(frontend)/page.tsx`, `ContactForm.tsx`, `dashboard/page.tsx`, `marketing/page.tsx`, `payload.config.ts`, `dependencies`, `@payloadcms/next`, `portfolio/page.tsx`, `20261002_140150_ordem_feed.ts`, `[slug]/page.tsx`, `package.json`, `LikeButton.tsx`, `seed.ts`, `admin.e2e.spec.ts`, `Projects.ts`?**
  _High betweenness centrality (0.101) - this node is a cross-community bridge._
- **Should `ContactForm.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12698412698412698 - nodes in this community are weakly interconnected._
- **Why does `@payloadcms/db-postgres` connect `@payloadcms/db-postgres` to `20261002_144740_como_eu_trabalho.ts`, `20260930_235140_initial.ts`, `20261001_161241_imagens_vercel_blob.ts`, `20261002_134058_contato_whatsapp.ts`, `vitest`, `20261002_140150_ordem_feed.ts`, `20261002_150425_instagram.ts`, `20261020_013314_dashboard_visualizacoes_por_dia.ts`, `20261020_015111_dashboard_origem_das_visitas.ts`, `20261024_151913_dashboard_mapa_das_visitas.ts`, `20261024_152828_dashboard_tempo_na_pagina.ts`, `20261024_173800_texto_de_apoio.ts`, `20261031_165422_materiais_marketing.ts`, `package.json`, `20261002_141521_formulario_contato.ts`, `index.ts`, `payload.config.ts`?**
  _High betweenness centrality (0.091) - this node is a cross-community bridge._
- **Should `dashboard/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12802275960170698 - nodes in this community are weakly interconnected._
- **Should `payload-types.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05555555555555555 - nodes in this community are weakly interconnected._