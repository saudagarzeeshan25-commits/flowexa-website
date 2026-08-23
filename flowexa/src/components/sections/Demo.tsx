import { useEffect, useState } from 'react'
import { Play, RotateCcw, PhoneMissed, MessageSquare, CheckCircle2, CalendarCheck, BarChart3 } from 'lucide-react'
import { Eyebrow } from '../ui/Eyebrow'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const STAGES = [
  { icon: PhoneMissed, label: 'Missed Call', detail: 'Customer calls, no one picks up.' },
  { icon: MessageSquare, label: 'Instant Recovery', detail: 'An automatic text goes out within seconds.' },
  { icon: MessageSquare, label: 'Customer Replies', detail: '"Yes, need a quote for a roof repair."' },
  { icon: CheckCircle2, label: 'AI Qualification', detail: 'Job type, timeline and address are gathered.' },
  { icon: CalendarCheck, label: 'Booking', detail: 'An open slot is offered and confirmed.' },
  { icon: BarChart3, label: 'Reporting', detail: 'The recovered lead is logged and measured.' },
]

export function Demo() {
  const ref = useScrollReveal<HTMLDivElement>()
  const [stage, setStage] = useState(-1)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!playing || stage >= STAGES.length - 1) return
    const t = setTimeout(() => setStage((s) => s + 1), 1600)
    return () => clearTimeout(t)
  }, [playing, stage])

  const start = () => {
    setStage(0)
    setPlaying(true)
  }
  const reset = () => {
    setStage(-1)
    setPlaying(false)
  }

  return (
    <section className="py-20 md:py-28 border-t border-white/5">
      <div ref={ref} className="mx-auto max-w-4xl px-5 sm:px-8">
        <Eyebrow>See It In Action</Eyebrow>
        <h2 data-reveal className="font-display font-semibold text-3xl sm:text-4xl max-w-xl leading-tight">
          A missed call, recovered.
        </h2>
        <p data-reveal className="mt-4 max-w-xl text-paper/60 text-sm sm:text-base leading-relaxed">
          A simplified walkthrough of what happens in the seconds and minutes after a call goes unanswered.
        </p>

        <div data-reveal className="mt-10 rounded-xl border border-white/10 bg-surface/40 p-6 sm:p-8">
          <div className="flex flex-col gap-3">
            {STAGES.map((s, i) => {
              const Icon = s.icon
              const isDone = i <= stage
              const isCurrent = i === stage
              return (
                <div
                  key={s.label}
                  className={`flex items-center gap-4 rounded-lg border px-4 py-3 transition-all duration-500 ${
                    isDone
                      ? 'border-cyan/40 bg-cyan/[0.06] opacity-100'
                      : 'border-white/8 opacity-40'
                  } ${isCurrent ? 'shadow-[0_0_0_1px_rgba(6,182,212,0.3)]' : ''}`}
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${
                      isDone ? 'border-cyan/50 text-cyan' : 'border-white/15 text-paper/40'
                    }`}
                  >
                    <Icon size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-display font-medium text-sm">{s.label}</p>
                    <p className="text-xs text-paper/55 truncate">{s.detail}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-7 flex items-center gap-3">
            <button
              onClick={start}
              disabled={playing && stage < STAGES.length - 1}
              className="inline-flex items-center gap-2 rounded-lg bg-blue px-4 py-2.5 text-sm font-medium font-display text-paper hover:bg-cyan transition-colors disabled:opacity-50"
            >
              <Play size={14} /> {stage >= 0 ? 'Replay Demo' : 'Run Demo'}
            </button>
            {stage >= 0 && (
              <button
                onClick={reset}
                className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2.5 text-sm font-display text-paper/80 hover:border-white/30 transition-colors"
              >
                <RotateCcw size={14} /> Reset
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
