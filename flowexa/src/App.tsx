import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { Hero } from './components/sections/Hero'
import { Problem } from './components/sections/Problem'
import { CoreSystem } from './components/sections/CoreSystem'
import { AISystems } from './components/sections/AISystems'
import { Industries } from './components/sections/Industries'
import { WhyFlowexa } from './components/sections/WhyFlowexa'
import { Process } from './components/sections/Process'
import { Demo } from './components/sections/Demo'
import { Proof } from './components/sections/Proof'
import { FreePilot } from './components/sections/FreePilot'
import { About } from './components/sections/About'
import { LeadCapturePopup } from './components/LeadCapturePopup'
import { useBookingWidget } from './components/BookingWidget'
import { useLeadCaptureTrigger } from './hooks/useLeadCaptureTrigger'

function App() {
  const { open: openBooking } = useBookingWidget()
  const { shouldShow, dismiss } = useLeadCaptureTrigger()

  return (
    <div className="min-h-screen bg-ink text-paper font-body">
      <Navbar onBookCall={openBooking} />
      <main>
        <Hero onBookCall={openBooking} />
        <Problem />
        <CoreSystem />
        <AISystems />
        <Industries />
        <WhyFlowexa />
        <Process />
        <Demo />
        <Proof />
        <FreePilot onBookCall={openBooking} />
        <About />
      </main>
      <Footer />
      {shouldShow && <LeadCapturePopup onClose={dismiss} />}
    </div>
  )
}

export default App
