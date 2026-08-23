import { INDUSTRIES } from '../../config/site'
import { Eyebrow } from '../ui/Eyebrow'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export function Industries() {
  const ref = useScrollReveal<HTMLDivElement>()

  return (
    <section id="industries" className="py-20 md:py-28 border-t border-white/5">
      <div ref={ref} className="mx-auto max-w-6xl px-5 sm:px-8">
        <Eyebrow>Industries</Eyebrow>
        <h2 data-reveal className="font-display font-semibold text-3xl sm:text-4xl max-w-xl leading-tight">
          Built for home-service businesses.
        </h2>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/10 rounded-xl overflow-hidden border border-white/10">
          {INDUSTRIES.map((ind) => (
            <div key={ind.title} data-reveal className="bg-ink p-6 sm:p-7">
              <h3 className="font-display font-semibold text-lg mb-2">{ind.title}</h3>
              <p className="text-sm text-paper/60 leading-relaxed">{ind.example}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
