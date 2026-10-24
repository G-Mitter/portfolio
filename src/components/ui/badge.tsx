import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

/** Etiqueta pequena: tecnologia (chip), status do projeto e o selo "Disponível". */
const badgeVariants = cva('inline-flex items-center', {
  variants: {
    variant: {
      chip: 'rounded-full border border-border px-2.5 py-[3px] font-mono text-xs',
      status: 'gap-1.5 font-mono text-xs',
      available:
        'gap-[7px] rounded-full border border-current px-[11px] py-[3px] text-[13px] font-semibold text-success no-underline',
    },
  },
  defaultVariants: { variant: 'chip' },
})

type BadgeProps = React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }

function Badge({ className, variant, asChild = false, ...props }: BadgeProps) {
  const Comp = asChild ? Slot : 'span'
  return <Comp className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
