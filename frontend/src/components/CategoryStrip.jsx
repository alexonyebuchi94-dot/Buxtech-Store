import { Link } from 'react-router-dom'

const categoryTiles = [
  {
    slug: 'kitchen-appliances',
    name: 'Kitchen Appliances',
    image: 'https://images.unsplash.com/photo-1648301037182-9dd1ad3c4d90?w=700',
  },
  {
    slug: 'electronics',
    name: 'Electronics',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=700',
  },
  {
    slug: 'laptop-desktop-gadgets',
    name: 'Laptop & Desktop Gadgets',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=700',
  },
]

export default function CategoryStrip() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <h2 className="font-display text-3xl text-ink mb-8 tracking-wide">SHOP BY CATEGORY</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {categoryTiles.map((cat) => (
          <Link
            key={cat.slug}
            to={`/shop?category=${cat.slug}`}
            className="group relative rounded-lg overflow-hidden aspect-[4/3] border border-border hover:border-cyan hover:shadow-glow transition-all duration-300"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-105 transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-base via-transparent to-transparent" />
            <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 left-0 p-5">
              <span className="font-display text-2xl text-ink tracking-wide">{cat.name}</span>
              <div className="text-cyan text-xs font-mono-price mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                BROWSE →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
