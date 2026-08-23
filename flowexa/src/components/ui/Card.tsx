import type { ReactNode } from 'react'

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      data-reveal
      className={`rounded-xl border border-white/10 bg-surface/60 p-6 transition-colors duration-200 hover:border-white/20 ${className}`}
    >
      {children}
    </div>
  )
}
