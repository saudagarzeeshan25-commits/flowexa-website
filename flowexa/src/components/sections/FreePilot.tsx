import { Button } from '../ui/Button'
import { Eyebrow } from '../ui/Eyebrow'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export function FreePilot({ onBookCall }: { onBookCall: () => void }) {
  const ref = useScrollReveal<HTMLDivElement>()

  return (
    <section id="pilot" className="py-20 md:py-28 border-t border-white/5">
      <div ref={ref} className="mx-auto max-w-4xl px-5 sm:px-8 text-center">
        <div className="flex justify-center">
          <Eyebrow>Free Pilot</Eyebrow>
        </div>
        <h2 data-reveal className="font-display font-semibold text-3xl sm:text-4xl leading-tight">
          Pilot Flowexa at No Setup Cost
        </h2>

        <p data-reveal className="mt-6 text-paper/65 leading-relaxed max-w-2xl mx-auto">
          Flowexa is currently working with a limited number of U.S. home-service businesses as
          pilot partners.
        </p>
        <p data-reveal className="mt-4 text-paper/65 leading-relaxed max-w-2xl mx-auto">
          Selected businesses can receive an initial implementation at no setup cost. The system
          is deployed and measured so both sides can determine whether it creates enough value to
          continue.
        </p>

        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button variant="primary" onClick={onBookCall}>
            Apply for the Free Pilot
          </Button>
          <Button variant="secondary" onClick={onBookCall}>
            Book a Strategy Call
          </Button>
        </div>
      </div>
    </section>
  )
}
