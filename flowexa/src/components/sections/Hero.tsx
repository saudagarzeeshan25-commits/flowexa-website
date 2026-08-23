import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Button } from '../ui/Button'
import { WorkflowPipeline } from '../ui/WorkflowPipeline'

const STEPS = [
  { label: 'Lead' },
  { label: 'AI Response' },
  { label: 'AI Qualification' },
  { label: 'Appointment' },
  { label: 'Follow-Up' },
  { label: 'Reporting' },
]

export function Hero({ onBookCall }: { onBookCall: () => void }) {
  const [active, setActive] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const id = setInterval(() => {
      setActive((v) => (v + 1) % (STEPS.length + 1))
    }, 1400)
    return () => clearInterval(id)
  }, [])

  return (
    <section id="top" ref={ref} className="relative pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden">
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[560px] w-[820px] rounded-full opacity-25 blur-[120px]"
        style={{ background: 'radial-gradient(circle, #2563EB, #06B6D4 45%, transparent 70%)' }}
      />
      <div className="absolute inset-0 bg-noise opacity-40 pointer-events-none" />

      <div className="relative mx-auto max-w-5xl px-5 sm:px-8 text-center">
        <div className="inline-flex items-center gap-2 mb-6 rounded-full border border-white/10 bg-surface/60 px-3.5 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
          <span className="font-mono-label text-xs uppercase text-paper/70">AI Revenue &amp; Operations Systems</span>
        </div>

        <h1 className="font-display font-semibold text-4xl sm:text-5xl md:text-6xl leading-[1.08] tracking-tight text-balance">
          Turn Missed Opportunities Into{' '}
          <span className="text-gradient">Booked Jobs.</span>
        </h1>

        <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-paper/65 leading-relaxed">
          Flowexa builds AI-powered systems that help home-service businesses respond faster,
          qualify prospects, automate follow-up, and keep their sales pipeline moving.
        </p>

        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button variant="primary" onClick={onBookCall}>
            Book a Strategy Call <ArrowRight size={16} />
          </Button>
          <Button variant="secondary" onClick={() => document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth' })}>
            Explore the Systems
          </Button>
        </div>
      </div>

      <div className="relative mx-auto max-w-4xl px-5 sm:px-8 mt-16">
        <div className="rounded-xl border border-white/10 bg-surface/50 p-5 sm:p-7">
          <p className="font-mono-label text-[11px] uppercase text-paper/40 mb-4">Lead Recovery Flow</p>
          <WorkflowPipeline steps={STEPS} active={active < STEPS.length ? active : STEPS.length - 1} />
        </div>
      </div>
    </section>
  )
}
