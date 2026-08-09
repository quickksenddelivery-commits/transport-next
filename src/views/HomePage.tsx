import PageMeta from '../components/PageMeta'
import Hero from '../components/Hero'
import HeroTrackBar from '../components/HeroTrackBar'
import BrandVideo from '../components/BrandVideo'
import Partners from '../components/Partners'
import Services from '../components/Services'
import HowItWorks from '../components/HowItWorks'
import Testimonials from '../components/Testimonials'
import CTABanner from '../components/CTABanner'

export default function HomePage() {
  return (
    <>
      <PageMeta title="Fast Reliable Freight & Logistics Worldwide" description="Accessiblexpress delivers parcels, freight, and household moves to 120+ countries. Real-time tracking, same-day express, and door-to-door service." />
      <Hero />
      <HeroTrackBar />
      <BrandVideo />
      <Partners />
      <Services />
      <HowItWorks />
      <Testimonials />
      <CTABanner />
    </>
  )
}
