export type LeadPayload = {
  firstName: string
  workEmail: string
  company: string
  source: string
  submittedAt: string
}

// Points at an n8n (or any) webhook URL once configured via VITE_LEAD_WEBHOOK_URL.
// Until then, submissions are logged locally so nothing is lost and the flow
// can be tested end-to-end before a webhook exists.
export async function submitLead(data: Omit<LeadPayload, 'submittedAt'>) {
  const webhookUrl = import.meta.env.VITE_LEAD_WEBHOOK_URL
  const payload: LeadPayload = { ...data, submittedAt: new Date().toISOString() }

  if (!webhookUrl) {
    console.info('[lead-capture] No webhook configured yet, payload ready to send:', payload)
    return { ok: true, delivered: false }
  }

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return { ok: res.ok, delivered: res.ok }
  } catch (err) {
    console.error('[lead-capture] Failed to deliver lead payload', err)
    return { ok: false, delivered: false }
  }
}
