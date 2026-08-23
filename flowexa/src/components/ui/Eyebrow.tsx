export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-4" data-reveal>
      <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
      <span className="font-mono-label text-xs uppercase text-cyan/90">{children}</span>
    </div>
  )
}
