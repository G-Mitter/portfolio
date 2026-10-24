import * as React from 'react'

import { cn } from '@/lib/utils'

/** Classes comuns de campo de texto; o Textarea reaproveita. */
export const fieldClass =
  'w-full rounded-lg border border-border bg-background px-3 py-[9px] text-foreground [font-family:inherit] [font-size:inherit] [line-height:inherit] font-normal aria-invalid:border-destructive'

function Input({ className, ...props }: React.ComponentProps<'input'>) {
  return <input className={cn(fieldClass, className)} {...props} />
}

export { Input }
