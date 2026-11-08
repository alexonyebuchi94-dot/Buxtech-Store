import { Link } from 'react-router-dom'
import SEO from '../components/SEO.jsx'
import TrustBadges from '../components/TrustBadges.jsx'

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <SEO title="About Us — BuxTech" description="BuxTech is a Lagos-based tech store for laptops, desktops, gadgets and gaming gear — genuine products delivered across Nigeria." path="/about" />
      <h1 className="font-display text-4xl sm:text-5xl text-ink mb-8 tracking-wide">ABOUT BUXTECH</h1>
      <div className="space-y-5 text-muted leading-relaxed">
        <p className="text-ink text-lg">Technology should empower everyone — not just those who know where to find the good stuff.</p>
        <p>BuxTech is a Lagos-based tech store built for students, creators, gamers, professionals and growing businesses. We sell laptops, desktops, the accessories and parts that keep them running, plus tech and gaming gadgets that make everyday life faster and more fun.</p>
        <p>Every product is genuine, tested before dispatch and backed by a 12-month warranty. You see honest Naira prices, pay securely with Paystack by card, transfer or USSD, and track your order from checkout to your doorstep.</p>
        <p>We started BuxTech because buying tech online in Nigeria shouldn’t feel like a gamble. So we promise three things: <span className="text-ink">genuine products</span>, <span className="text-ink">fast delivery</span> and <span className="text-ink">support that actually answers</span> — our AI assistant helps instantly and a real person is always one tap away.</p>
        <p>We’re based in Lagos and deliver across Nigeria. <Link to="/customer-service" className="text-cyan hover:underline">Say hello</Link> — we’d love to help you power your world.</p>
      </div>
      <div className="mt-10"><TrustBadges /></div>
    </div>
  )
}
