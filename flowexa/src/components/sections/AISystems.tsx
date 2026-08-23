import { CORE_SYSTEMS, ADDITIONAL_SYSTEMS } from '../../config/site'
import { Card } from '../ui/Card'
import { Eyebrow } from '../ui/Eyebrow'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export function AISystems() {
  const ref = useScrollReveal<HTMLDivElement>({ stagger: 0.05 })

  return (
    <section id="solutions" className="py-20 md:py-28 border-t border-white/5">
      <div ref={ref} className="mx-auto max-w-6xl px-5 sm:px-8">
        <Eyebrow>Solutions</Eyebrow>
        <h2 data-reveal className="font-display font-semibold text-3xl sm:text-4xl max-w-xl leading-tight">
          Systems built for how your business books jobs.
        </h2>

        <p data-reveal className="mt-6 font-mono-label text-xs uppercase text-paper/40">Core Revenue Systems</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CORE_SYSTEMS.map((s) => (
            <Card key={s.n}>
              <span className="font-mono-label text-xs text-cyan/80">{s.n}</span>
              <h3 className="font-display font-semibold text-base mt-2 mb-2">{s.title}</h3>
              <p className="text-sm text-paper/60 leading-relaxed mb-3">{s.desc}</p>
              <p className="text-xs text-violet/80 font-mono-label">Built and configured around your business.</p>
            </Card>
          ))}
        </div>

        <p data-reveal className="mt-12 font-mono-label text-xs uppercase text-paper/40">Additional AI Systems</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ADDITIONAL_SYSTEMS.map((s) => (
            <Card key={s.n}>
              <span className="font-mono-label text-xs text-cyan/80">{s.n}</span>
              <h3 className="font-display font-semibold text-base mt-2 mb-2">{s.title}</h3>
              <p className="text-sm text-paper/60 leading-relaxed mb-3">{s.desc}</p>
              <p className="text-xs text-violet/80 font-mono-label">Built and configured around your business.</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
