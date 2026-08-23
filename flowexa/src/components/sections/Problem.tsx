import { PROBLEMS } from '../../config/site'
import { Card } from '../ui/Card'
import { Eyebrow } from '../ui/Eyebrow'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export function Problem() {
  const ref = useScrollReveal<HTMLDivElement>()

  return (
    <section className="py-20 md:py-28 border-t border-white/5">
      <div ref={ref} className="mx-auto max-w-6xl px-5 sm:px-8">
        <Eyebrow>The Problem</Eyebrow>
        <h2 data-reveal className="font-display font-semibold text-3xl sm:text-4xl max-w-xl leading-tight">
          Most Revenue Leaks Happen Before the Sale.
        </h2>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PROBLEMS.map((p) => (
            <Card key={p.n}>
              <span className="font-mono-label text-xs text-blue/80">{p.n}</span>
              <h3 className="font-display font-semibold text-lg mt-2 mb-2">{p.title}</h3>
              <p className="text-sm text-paper/60 leading-relaxed">{p.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
