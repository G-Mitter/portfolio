import { notFound } from 'next/navigation'

// Qualquer endereço que não existe cai aqui e mostra a 404 em português do not-found.tsx.
// Sem isso o Next usa a 404 padrão em inglês, porque o site tem dois layouts raiz (site e /admin).
export default function CatchAll() {
  notFound()
}
