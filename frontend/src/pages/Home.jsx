import Hero from '../components/Hero.jsx'
import CategoryStrip from '../components/CategoryStrip.jsx'
import FeaturedProducts from '../components/FeaturedProducts.jsx'
import Testimonials from '../components/Testimonials.jsx'
import TrustStrip from '../components/TrustStrip.jsx'
import CTABanner from '../components/CTABanner.jsx'
import Reveal from '../components/Reveal.jsx'

export default function Home() {
  return (
    <>
      <Hero />
      <Reveal><CategoryStrip /></Reveal>
      <Reveal delay={100}><FeaturedProducts /></Reveal>
      <Reveal><Testimonials /></Reveal>
      <Reveal delay={100}><TrustStrip /></Reveal>
      <Reveal><CTABanner /></Reveal>
    </>
  )
}
