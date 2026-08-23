import { useEffect } from 'react'
import { CAL_LINK, CAL_CONFIG } from '../config/booking'

// Loads the Cal.com embed script once and exposes a global `openCalBooking`
// trigger. Kept isolated so the booking integration can be swapped or
// reconfigured (VITE_CAL_LINK) without touching any other component.

declare global {
  interface Window {
    Cal?: any
  }
}

let calInitialized = false

function initCal() {
  if (calInitialized || typeof window === 'undefined') return
  calInitialized = true

  ;(function (C: any, A: string, L: string) {
    let p = function (a: any, ar: any) {
      a.q.push(ar)
    }
    let d = C.document
    C.Cal =
      C.Cal ||
      function () {
        let cal = C.Cal
        let ar = arguments
        if (!cal.loaded) {
          cal.ns = {}
          cal.q = cal.q || []
          d.head.appendChild(d.createElement('script')).src = A
          cal.loaded = true
        }
        if (ar[0] === L) {
          const api: any = function () {
            p(api, arguments)
          }
          const namespace = ar[1]
          api.q = api.q || []
          if (typeof namespace === 'string') {
            cal.ns[namespace] = cal.ns[namespace] || api
            p(cal.ns[namespace], ar)
            p(cal, ['initNamespace', namespace])
          } else p(cal, ar)
          return
        }
        p(cal, ar)
      }
  })(window, 'https://app.cal.com/embed/embed.js', 'init')

  window.Cal!('init', CAL_CONFIG.namespace, { origin: 'https://cal.com' })
  window.Cal!.ns[CAL_CONFIG.namespace]('ui', {
    styles: CAL_CONFIG.styles,
    hideEventTypeDetails: false,
    layout: 'month_view',
  })
}

export function useBookingWidget() {
  useEffect(() => {
    initCal()
  }, [])

  const open = () => {
    if (!window.Cal) return
    window.Cal.ns[CAL_CONFIG.namespace]('modal', {
      calLink: CAL_LINK,
      config: { layout: 'month_view' },
    })
  }

  return { open }
}
