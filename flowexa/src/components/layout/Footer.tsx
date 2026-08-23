import { NAV_LINKS } from '../../config/site'

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img src="/assets/logo-mark.png" alt="Flowexa" className="h-6 w-6 object-contain" />
              <span className="font-display font-semibold text-base">Flowexa</span>
            </div>
            <p className="text-sm text-paper/60 max-w-xs">AI Revenue & Operations Systems</p>
          </div>

          <div className="grid grid-cols-2 gap-6 text-sm">
            <div className="flex flex-col gap-3">
              {NAV_LINKS.map((l) => (
                <a key={l.href} href={l.href} className="text-paper/60 hover:text-paper transition-colors">
                  {l.label}
                </a>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <a href="#pilot" className="text-paper/60 hover:text-paper transition-colors">Free Pilot</a>
              <a href="#book" className="text-paper/60 hover:text-paper transition-colors">Book a Call</a>
              <a href="mailto:hello@flowexa.space" className="text-paper/60 hover:text-paper transition-colors">Contact</a>
              <a href="/privacy" className="text-paper/60 hover:text-paper transition-colors">Privacy</a>
              <a href="/terms" className="text-paper/60 hover:text-paper transition-colors">Terms</a>
            </div>
          </div>

          <div className="flex md:justify-end items-start">
            <div className="flex items-center gap-2 rounded-full border border-white/10 px-3.5 py-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="font-mono-label text-[11px] uppercase text-paper/70">System Operational</span>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between gap-2 text-xs text-paper/40">
          <span>© {new Date().getFullYear()} Flowexa. All rights reserved.</span>
          <span>flowexa.space</span>
        </div>
      </div>
    </footer>
  )
}
