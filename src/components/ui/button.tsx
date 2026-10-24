import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * Botão do site. O cva guarda as "receitas": uma base comum e uma variante
 * (cor) e um tamanho. Trocar o visual de todos os botões = mexer só aqui.
 */
const buttonVariants = cva(
  'inline-block cursor-pointer rounded-lg border font-semibold no-underline disabled:cursor-wait disabled:opacity-60',
  {
    variants: {
      variant: {
        outline: 'border-border bg-card text-foreground',
        default: 'border-primary bg-primary text-primary-foreground',
        whatsapp: 'border-whatsapp bg-whatsapp text-white',
      },
      size: {
        default: 'px-3.5 py-1.5 text-sm',
        lg: 'px-4.5 py-2.5 text-[15px]',
      },
    },
    defaultVariants: { variant: 'outline', size: 'default' },
  },
)

type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    /** Com asChild o estilo vai para o filho (ex.: <Link>) em vez de criar um <button>. */
    asChild?: boolean
  }

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
}

export { Button, buttonVariants }
