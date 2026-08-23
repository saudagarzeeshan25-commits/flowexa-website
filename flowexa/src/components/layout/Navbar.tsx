import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { NAV_LINKS } from '../../config/site'
import { Button } from '../ui/Button'

export function Navbar({ onBookCall }: { onBookCall: () => void }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-ink/85 backdrop-blur-md border-b border-white/10' : 'bg-transparent border-b border-transparent'
      }`}
    >
      <nav className="mx-auto max-w-7xl px-5 sm:px-8 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 shrink-0">
          <img src="/assets/logo-mark.png" alt="Flowexa" className="h-7 w-7 object-contain" />
          <span className="font-display font-semibold text-lg tracking-tight">Flowexa</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-paper/75 hover:text-paper transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <a href="#pilot" className="text-sm text-paper/75 hover:text-paper transition-colors px-2">
            Free Pilot
          </a>
          <Button variant="primary" onClick={onBookCall}>
            Book a Strategy Call
          </Button>
        </div>

        <button
          className="md:hidden p-2 text-paper"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="md:hidden bg-ink/95 backdrop-blur-md border-b border-white/10 px-5 pb-6 pt-2 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="py-3 text-base text-paper/85 border-b border-white/5"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#pilot"
            onClick={() => setMobileOpen(false)}
            className="py-3 text-base text-paper/85"
          >
            Free Pilot
          </a>
          <Button
            variant="primary"
            className="mt-3 w-full"
            onClick={() => {
              setMobileOpen(false)
              onBookCall()
            }}
          >
            Book a Strategy Call
          </Button>
        </div>
      )}
    </header>
  )
}
