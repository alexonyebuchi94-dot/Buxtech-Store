import Hero from '../components/Hero.jsx'
import CategoryStrip from '../components/CategoryStrip.jsx'
import FeaturedProducts from '../components/FeaturedProducts.jsx'
import TechStory from '../components/TechStory.jsx'
import WhyShopWithUs from '../components/WhyShopWithUs.jsx'
import Testimonials from '../components/Testimonials.jsx'
import TrustStrip from '../components/TrustStrip.jsx'
import CTABanner from '../components/CTABanner.jsx'
import Reveal from '../components/Reveal.jsx'
import SEO from '../components/SEO.jsx'

// Landing page ("/")
export default function Home() {
  return (
    <>
      <SEO
        title="BuxTech — Power Your World"
        description="BuxTech — laptops, desktops, tech gadgets and gaming gear, delivered across Nigeria."
        keywords="BuxTech, buy laptops Nigeria, gaming gadgets Lagos, desktop parts Nigeria, laptop accessories Nigeria, online tech store Nigeria"
        path="/"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Store',
          name: 'BuxTech',
          url: 'https://buxtech-store.vercel.app',
          description: 'Laptops, desktops, tech gadgets and gaming gear delivered across Nigeria.',
          areaServed: 'NG',
          telephone: '+2348123590484',
          email: 'buxtech27@gmail.com',
        }}
      />
      <Hero />
      <Reveal><CategoryStrip /></Reveal>
      <Reveal><TechStory /></Reveal>
      <Reveal delay={100}><FeaturedProducts /></Reveal>
      <Reveal><WhyShopWithUs /></Reveal>
      <Reveal delay={100}><Testimonials /></Reveal>
      <Reveal><TrustStrip /></Reveal>
      <Reveal delay={100}><CTABanner /></Reveal>
    </>
  )
}
