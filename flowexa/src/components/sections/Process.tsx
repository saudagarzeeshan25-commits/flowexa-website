import { PROCESS_STEPS } from '../../config/site'
import { Eyebrow } from '../ui/Eyebrow'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export function Process() {
  const ref = useScrollReveal<HTMLDivElement>({ stagger: 0.06 })

  return (
    <section id="process" className="py-20 md:py-28 border-t border-white/5">
      <div ref={ref} className="mx-auto max-w-6xl px-5 sm:px-8">
        <Eyebrow>How It Works</Eyebrow>
        <h2 data-reveal className="font-display font-semibold text-3xl sm:text-4xl max-w-xl leading-tight">
          From Process Audit to Production System
        </h2>

        <div className="mt-14 relative">
          <div className="hidden md:block absolute top-5 left-0 right-0 h-px bg-white/10" />
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 md:gap-4">
            {PROCESS_STEPS.map((step) => (
              <div key={step.n} data-reveal className="relative">
                <div className="hidden md:flex h-10 w-10 rounded-full border border-white/15 bg-ink items-center justify-center relative z-10 mb-4">
                  <span className="font-mono-label text-[11px] text-cyan">{step.n}</span>
                </div>
                <span className="md:hidden font-mono-label text-xs text-cyan/80">{step.n}</span>
                <h3 className="font-display font-semibold text-sm mt-1.5 mb-1.5">{step.title}</h3>
                <p className="text-xs text-paper/55 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
