import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Junta classes do Tailwind; se duas brigam (ex.: px-2 e px-4), a última vence. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
