import { Slot } from '@radix-ui/react-slot'
import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * A "caixinha" do site: borda e fundo do tema. O espaçamento interno (padding)
 * fica por conta de quem usa, porque cada seção tem o seu.
 */
function Card({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<'div'> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'div'
  return <Comp className={cn('rounded-xl border border-border bg-card', className)} {...props} />
}

export { Card }
