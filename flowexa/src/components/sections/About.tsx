import { Eyebrow } from '../ui/Eyebrow'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export function About() {
  const ref = useScrollReveal<HTMLDivElement>()

  return (
    <section id="about" className="py-20 md:py-28 border-t border-white/5">
      <div ref={ref} className="mx-auto max-w-5xl px-5 sm:px-8">
        <Eyebrow>About</Eyebrow>
        <h2 data-reveal className="font-display font-semibold text-3xl sm:text-4xl max-w-xl leading-tight">
          Why Flowexa exists.
        </h2>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 items-start">
          <div data-reveal className="h-44 w-44 rounded-xl border border-white/10 bg-surface/60 flex items-center justify-center overflow-hidden">
            {/* Replace with a real founder photo */}
            <img src="/assets/logo-mark.png" alt="Founder placeholder" className="h-16 w-16 object-contain opacity-60" />
          </div>

          <div data-reveal>
            <p className="text-paper/70 leading-relaxed mb-4">
              Home-service businesses lose jobs in the gap between a lead coming in and someone
              getting back to them — not because the work isn't good, but because response speed
              and follow-up are hard to keep consistent by hand.
            </p>
            <p className="text-paper/70 leading-relaxed mb-4">
              Flowexa was built to close that gap: practical AI systems designed around how a
              business already operates, not a generic chatbot bolted onto a website.
            </p>
            <p className="text-paper/70 leading-relaxed">
              The company is early-stage and working directly with a small number of pilot
              partners to prove the approach before scaling it further.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
