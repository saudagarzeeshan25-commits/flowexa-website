# Flowexa — flowexa.space

AI Revenue & Operations Systems website for U.S. home-service businesses.
Built with React, TypeScript, Tailwind CSS v4, and GSAP.

## Run locally

```bash
npm install
npm run dev
```

## Build for production

```bash
npm run build   # outputs to dist/
npm run preview # serve the production build locally
```

## Configuration

Copy `.env.example` to `.env` and fill in:

- `VITE_CAL_LINK` — your Cal.com username/event-slug (e.g. `flowexa/strategy-call`).
  No API key is required; this is a public booking link. Booking logic lives
  entirely in `src/components/BookingWidget.tsx` and `src/config/booking.ts`.
- `VITE_LEAD_WEBHOOK_URL` — optional. Once you have an n8n (or other) webhook
  for the exit-intent lead capture form, add the URL here. Until it's set,
  submissions are logged to the browser console instead of lost. Logic lives
  in `src/lib/leadWebhook.ts`.

## Structure

- `src/components/layout/` — Navbar, Footer
- `src/components/sections/` — one file per page section (Hero, Problem,
  CoreSystem, AISystems, Industries, WhyFlowexa, Process, Demo, Proof,
  FreePilot, About)
- `src/components/ui/` — Button, Card, Eyebrow, WorkflowPipeline
- `src/config/site.ts` — all section copy and list content in one place
- `src/config/booking.ts` — Cal.com config
- `src/hooks/` — useScrollReveal (GSAP), useLeadCaptureTrigger (exit-intent/scroll)

## Verified

- `npx tsc --noEmit` — 0 errors
- `npx oxlint src` — 0 warnings, 0 errors
- `npm run build` — succeeds, ~339 KB JS / ~29 KB CSS (gzip: ~115 KB / ~6 KB)
- Preview server: index, logo assets, favicon, robots.txt all return HTTP 200
- Key section copy confirmed present in the production bundle

Not yet done: a real headless-browser visual pass (blocked in the build
sandbox — no route to a browser-binary CDN). Worth a manual look on desktop
and a phone before shipping, particularly the hero pipeline animation and the
mobile nav menu.

## Not included on purpose

No fake testimonials, client logos, review stats, or credentials — per brief,
the Proof section only shows metric categories labeled "Measured During
Pilot," left empty until real pilot data exists.
