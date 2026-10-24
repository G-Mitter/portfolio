import * as React from 'react'

import { cn } from '@/lib/utils'

import { fieldClass } from './input'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return <textarea className={cn(fieldClass, 'resize-y', className)} {...props} />
}

export { Textarea }
