import Hero from '../components/Hero.jsx'
import CategoryStrip from '../components/CategoryStrip.jsx'
import FeaturedProducts from '../components/FeaturedProducts.jsx'
import WhyShopWithUs from '../components/WhyShopWithUs.jsx'
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
      <Reveal><WhyShopWithUs /></Reveal>
      <Reveal delay={100}><Testimonials /></Reveal>
      <Reveal><TrustStrip /></Reveal>
      <Reveal delay={100}><CTABanner /></Reveal>
    </>
  )
}
