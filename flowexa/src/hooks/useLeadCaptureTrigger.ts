import { useEffect, useState } from 'react'

const DISMISS_KEY = 'flowexa_lead_popup_dismissed'

export function useLeadCaptureTrigger() {
  const [shouldShow, setShouldShow] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem(DISMISS_KEY)) return

    const isMobile = window.matchMedia('(pointer: coarse)').matches
    let triggered = false

    const fire = () => {
      if (triggered) return
      triggered = true
      setShouldShow(true)
    }

    if (isMobile) {
      const onScroll = () => {
        const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight)
        if (scrolled > 0.5) {
          fire()
          window.removeEventListener('scroll', onScroll)
        }
      }
      window.addEventListener('scroll', onScroll, { passive: true })
      return () => window.removeEventListener('scroll', onScroll)
    }

    const timer = setTimeout(fire, 25000)
    const onExitIntent = (e: MouseEvent) => {
      if (e.clientY <= 0) fire()
    }
    document.addEventListener('mouseleave', onExitIntent)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mouseleave', onExitIntent)
    }
  }, [])

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, '1')
    setShouldShow(false)
  }

  return { shouldShow, dismiss }
}
