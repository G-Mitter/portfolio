import Link from 'next/link'

import { Button } from '@/components/ui/button'

export const metadata = { title: 'Página não encontrada' }

// Aparece quando o endereço não existe ou o projeto foi despublicado.
export default function NotFound() {
  return (
    <div className="empty">
      <h1>Página não encontrada</h1>
      <p>O link pode estar errado ou o projeto saiu do ar.</p>
      <Button asChild variant="default">
        <Link href="/portfolio">Ver os projetos</Link>
      </Button>
    </div>
  )
}
