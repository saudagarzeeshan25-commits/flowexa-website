import { Eyebrow } from '../ui/Eyebrow'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const METRICS = [
  { label: 'Response Time', note: 'Measured During Pilot' },
  { label: 'Qualified Leads', note: 'Measured During Pilot' },
  { label: 'Appointments Booked', note: 'Measured During Pilot' },
  { label: 'Recovered Opportunities', note: 'Measured During Pilot' },
]

export function Proof() {
  const ref = useScrollReveal<HTMLDivElement>({ stagger: 0.06 })

  return (
    <section className="py-20 md:py-28 border-t border-white/5">
      <div ref={ref} className="mx-auto max-w-6xl px-5 sm:px-8">
        <Eyebrow>Proof</Eyebrow>
        <h2 data-reveal className="font-display font-semibold text-3xl sm:text-4xl max-w-xl leading-tight">
          Built to Be Measured.
        </h2>
        <p data-reveal className="mt-4 max-w-xl text-paper/60 text-sm sm:text-base leading-relaxed">
          Flowexa is early-stage. Rather than showcase testimonials or numbers we haven't earned
          yet, every pilot is measured on the metrics that actually matter.
        </p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {METRICS.map((m) => (
            <div key={m.label} data-reveal className="rounded-xl border border-white/10 bg-surface/40 p-6">
              <p className="font-display font-semibold text-base mb-2">{m.label}</p>
              <p className="font-mono-label text-xs uppercase text-violet/80">{m.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
