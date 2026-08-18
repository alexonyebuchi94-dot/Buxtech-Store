import Hero from '../components/Hero.jsx'
import CategoryStrip from '../components/CategoryStrip.jsx'
import FeaturedProducts from '../components/FeaturedProducts.jsx'
import WhyShopWithUs from '../components/WhyShopWithUs.jsx'
import Testimonials from '../components/Testimonials.jsx'
import TrustStrip from '../components/TrustStrip.jsx'
import CTABanner from '../components/CTABanner.jsx'
import Reveal from '../components/Reveal.jsx'
import SEO from '../components/SEO.jsx'

export default function Home() {
  return (
    <>
      <SEO
        title="BuxTech — Power Your World"
        description="BuxTech — kitchen appliances, electronics, and laptop & desktop gadgets, delivered across Nigeria."
        keywords="BuxTech, buy electronics Nigeria, kitchen appliances Lagos, laptop accessories Nigeria, online electronics store Nigeria"
        path="/"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'BuxTech',
          url: 'https://buxtech-store.vercel.app',
        }}
      />
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
