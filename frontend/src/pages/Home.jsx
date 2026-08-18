import Hero from '../components/Hero.jsx'
import CategoryStrip from '../components/CategoryStrip.jsx'
import FeaturedProducts from '../components/FeaturedProducts.jsx'
import Testimonials from '../components/Testimonials.jsx'
import TrustStrip from '../components/TrustStrip.jsx'
import CTABanner from '../components/CTABanner.jsx'

export default function Home() {
  return (
    <>
      <Hero />
      <CategoryStrip />
      <FeaturedProducts />
      <Testimonials />
      <TrustStrip />
      <CTABanner />
    </>
  )
}
