import { useState, useEffect } from 'react';

const SLIDES = [
  { title: 'New Deals This Week', sub: 'Up to 30% off kitchen appliances', cta: '/category/kitchen' },
  { title: 'Laptops From ₦180,000', sub: 'Original, warrantied, delivered fast', cta: '/category/laptops' },
  { title: 'Kitchen Sale', sub: 'Blenders, air fryers, kettles', cta: '/category/kitchen' },
];

export function HeroBanner() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 4000);
    return () => clearInterval(t);
  }, []);
  const slide = SLIDES[index];
  return (
    <div className="bg-gradient-to-r from-[#0d1117] to-[#111827] rounded-lg p-10 md:p-16 text-center border border-gray-800">
      <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">{slide.title}</h1>
      <p className="text-gray-400 mb-6">{slide.sub}</p>
      <a href={slide.cta} className="inline-block bg-cyan-400 text-black font-bold px-6 py-3 rounded">
        Shop Now
      </a>
      <div className="flex justify-center gap-2 mt-6">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2 h-2 rounded-full ${i === index ? 'bg-cyan-400' : 'bg-gray-600'}`}
          />
        ))}
      </div>
    </div>
  );
}

export function TrustBadges() {
  const badges = ['Original Products', 'Fast Delivery', '7-Day Return', 'Paystack Secured'];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-10">
      {badges.map((b) => (
        <div key={b} className="bg-[#0d1117] border border-gray-800 rounded p-4 text-center text-gray-300 text-sm">
          {b}
        </div>
      ))}
    </div>
  );
}

export function CategoryBlocks({ categories = [] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-10">
      {categories.map((cat) => (
        <a key={cat.id} href={`/category/${cat.slug}`} className="group relative rounded overflow-hidden h-40">
          <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
          <div className="absolute inset-0 bg-black/50 flex items-end p-3">
            <span className="text-white font-bold">{cat.name}</span>
          </div>
        </a>
      ))}
    </div>
  );
}

export function WhyShopWithUs() {
  const points = [
    { title: 'Cheaper than Jumia', body: 'Direct-from-Alaba pricing, no middlemen markup' },
    { title: 'Real Lagos Support', body: 'Talk to a real person on WhatsApp, not a bot' },
    { title: 'Verified Original', body: 'Every product checked before it ships' },
    { title: 'Fast Local Delivery', body: 'Lagos orders in 24-48 hours' },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-10">
      {points.map((p) => (
        <div key={p.title} className="bg-[#0d1117] border border-gray-800 rounded p-5">
          <h3 className="text-cyan-400 font-bold mb-2">{p.title}</h3>
          <p className="text-gray-400 text-sm">{p.body}</p>
        </div>
      ))}
    </div>
  );
}

export function FeaturedProducts({ title, products = [] }) {
  return (
    <div className="my-10">
      <h2 className="text-white text-xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((p) => (
          <a key={p.id} href={`/product/${p.slug}`} className="bg-[#0d1117] border border-gray-800 rounded overflow-hidden hover:border-cyan-400 transition">
            <img src={p.images?.[0]} alt={p.name} className="w-full h-36 object-cover" />
            <div className="p-3">
              <p className="text-white text-sm truncate">{p.name}</p>
              <p className="text-cyan-400 font-bold">₦{Number(p.price).toLocaleString()}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
