import { Eyebrow } from '../ui/Eyebrow'
import { WorkflowPipeline } from '../ui/WorkflowPipeline'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const STEPS = [
  { label: 'Capture' },
  { label: 'AI Response' },
  { label: 'AI Qualification' },
  { label: 'AI Booking' },
  { label: 'Confirmation' },
  { label: 'Reminder' },
  { label: 'Follow-Up' },
  { label: 'Reporting' },
]

export function CoreSystem() {
  const ref = useScrollReveal<HTMLDivElement>()

  return (
    <section className="py-20 md:py-28 border-t border-white/5">
      <div ref={ref} className="mx-auto max-w-6xl px-5 sm:px-8">
        <Eyebrow>The System</Eyebrow>
        <h2 data-reveal className="font-display font-semibold text-3xl sm:text-4xl max-w-xl leading-tight">
          The Flowexa Lead Recovery System
        </h2>
        <p data-reveal className="mt-4 max-w-xl text-paper/60 text-sm sm:text-base leading-relaxed">
          One operational system that carries a lead from first contact to a reported outcome —
          built and configured around how your business already works.
        </p>

        <div data-reveal className="mt-12 rounded-xl border border-white/10 bg-surface/40 p-6 sm:p-8 overflow-x-auto">
          <div className="min-w-[720px] md:min-w-0">
            <WorkflowPipeline steps={STEPS} />
          </div>
        </div>
      </div>
    </section>
  )
}
