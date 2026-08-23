import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
  children: ReactNode
}

export function Button({ variant = 'primary', className = '', children, ...rest }: Props) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-medium font-display transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2'

  const styles: Record<string, string> = {
    primary:
      'bg-blue text-paper hover:bg-cyan shadow-[0_0_0_1px_rgba(37,99,235,0.4)] hover:shadow-[0_0_20px_rgba(6,182,212,0.35)]',
    secondary:
      'border border-white/15 text-paper hover:border-white/30 hover:bg-white/5',
    ghost: 'text-paper/80 hover:text-paper',
  }

  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...rest}>
      {children}
    </button>
  )
}
