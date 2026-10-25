import {
  siCss, siDocker, siGit, siGithub, siGithubpages, siGooglegemini, siGoogleappsscript, siHtml5,
  siJavascript, siMysql, siNextdotjs, siNodedotjs, siNumpy, siOpenjdk, siPandas, siPayloadcms,
  siPostgresql, siPython, siReact, siRust, siSelenium, siSpringboot, siSqlite, siTailwindcss,
  siTauri, siTypescript, siVercel, siWhatsapp,
} from 'simple-icons'

import { Badge } from '@/components/ui/badge'

/**
 * Ícones das tecnologias mais comuns. A chave é o nome em minúsculas e sem espaços ou pontos,
 * para "Next.js", "next js" e "NextJS" caírem no mesmo ícone. Nome sem ícone aqui vira etiqueta só com texto.
 */
const ICONS: Record<string, { path: string }> = {
  css: siCss, docker: siDocker, git: siGit, github: siGithub, githubpages: siGithubpages,
  gemini: siGooglegemini, appsscript: siGoogleappsscript, googleappsscript: siGoogleappsscript,
  html: siHtml5, javascript: siJavascript, mysql: siMysql, nextjs: siNextdotjs, nodejs: siNodedotjs,
  numpy: siNumpy, java: siOpenjdk, pandas: siPandas, payloadcms: siPayloadcms,
  postgresql: siPostgresql, python: siPython, react: siReact, rust: siRust, selenium: siSelenium,
  springboot: siSpringboot, sqlite: siSqlite, tailwind: siTailwindcss, tailwindcss: siTailwindcss,
  tauri: siTauri, typescript: siTypescript, vercel: siVercel, apiwhatsapp: siWhatsapp,
}

/** Etiqueta de tecnologia, com o ícone quando existe. O ícone é só enfeite (aria-hidden): o nome está no texto. */
export function TechBadge({ name }: { name: string }) {
  const icon = ICONS[name.toLowerCase().replace(/[\s.]/g, '')]

  return (
    <Badge className="gap-1.5">
      {icon && (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
          <path d={icon.path} />
        </svg>
      )}
      {name}
    </Badge>
  )
}
