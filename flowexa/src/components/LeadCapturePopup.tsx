import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from './ui/Button'
import { submitLead } from '../lib/leadWebhook'

export function LeadCapturePopup({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ firstName: '', workEmail: '', company: '' })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    await submitLead({ ...form, source: 'exit_intent_popup' })
    setStatus('done')
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button
        className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-xl border border-white/10 bg-surface p-7">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-paper/50 hover:text-paper transition-colors"
          aria-label="Close popup"
        >
          <X size={18} />
        </button>

        {status === 'done' ? (
          <div className="py-6">
            <h3 className="font-display text-xl font-semibold mb-2">Checklist on its way.</h3>
            <p className="text-sm text-paper/70">Check your inbox — we've sent the Flowexa Lead Recovery Checklist to {form.workEmail}.</p>
          </div>
        ) : (
          <>
            <h3 className="font-display text-xl font-semibold mb-2 pr-6">
              Want to Find Where Your Leads Are Leaking?
            </h3>
            <p className="text-sm text-paper/65 mb-5">Get the Flowexa Lead Recovery Checklist.</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                required
                placeholder="First name"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                className="rounded-lg border border-white/15 bg-ink/60 px-4 py-2.5 text-sm text-paper placeholder:text-paper/40 outline-none focus:border-cyan/60"
              />
              <input
                required
                type="email"
                placeholder="Work email"
                value={form.workEmail}
                onChange={(e) => setForm({ ...form, workEmail: e.target.value })}
                className="rounded-lg border border-white/15 bg-ink/60 px-4 py-2.5 text-sm text-paper placeholder:text-paper/40 outline-none focus:border-cyan/60"
              />
              <input
                required
                placeholder="Company"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="rounded-lg border border-white/15 bg-ink/60 px-4 py-2.5 text-sm text-paper placeholder:text-paper/40 outline-none focus:border-cyan/60"
              />

              <Button type="submit" variant="primary" className="mt-1 w-full" disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Sending…' : 'Get the Checklist'}
              </Button>

              <p className="text-[11px] text-paper/40 mt-1">
                By submitting, you agree to receive the checklist and occasional emails from Flowexa. Unsubscribe anytime.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
