import { WHY_PRINCIPLES } from '../../config/site'
import { Eyebrow } from '../ui/Eyebrow'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const POINTS = [
  'Existing tools remain part of the workflow',
  'Human fallback on every automated step',
  'Clear reporting on what the system is doing',
  'Modular architecture that can grow with the business',
  'Built to be maintained, not just switched on',
]

export function WhyFlowexa() {
  const ref = useScrollReveal<HTMLDivElement>()

  return (
    <section className="py-20 md:py-28 border-t border-white/5">
      <div ref={ref} className="mx-auto max-w-6xl px-5 sm:px-8">
        <Eyebrow>Why Flowexa</Eyebrow>
        <h2 data-reveal className="font-display font-semibold text-3xl sm:text-4xl max-w-xl leading-tight">
          Automation That Works Around Your Business.
        </h2>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {WHY_PRINCIPLES.map((p) => (
            <div key={p.n} data-reveal>
              <span className="font-mono-label text-xs text-blue/80">{p.n}</span>
              <h3 className="font-display font-semibold text-lg mt-2 mb-2">{p.title}</h3>
              <p className="text-sm text-paper/60 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        <div data-reveal className="mt-12 rounded-xl border border-white/10 bg-surface/40 p-6 sm:p-8">
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
            {POINTS.map((pt) => (
              <li key={pt} className="flex items-start gap-2.5 text-sm text-paper/70">
                <span className="mt-1.5 h-1 w-1 rounded-full bg-cyan shrink-0" />
                {pt}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
