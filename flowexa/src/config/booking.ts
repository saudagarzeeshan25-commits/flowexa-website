// Cal.com configuration is isolated here.
// Set VITE_CAL_LINK in a .env file, e.g. VITE_CAL_LINK=your-username/strategy-call
// No API keys are required or stored — this is a public booking link only.

export const CAL_LINK: string = import.meta.env.VITE_CAL_LINK || 'flowexa/strategy-call'

export const CAL_CONFIG = {
  namespace: 'strategy-call',
  styles: { branding: { brandColor: '#2563EB' } },
}
