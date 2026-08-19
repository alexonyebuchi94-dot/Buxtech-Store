import { nanoid } from 'nanoid'
import Product from '../models/Product.js'
import { isDBConnected } from '../lib/db.js'

// Works two ways:
//  - MONGODB_URI set + connected -> products persist permanently in MongoDB Atlas.
//  - not set -> falls back to an in-memory store seeded with starter products,
//    but everything resets whenever the server restarts.
// Add MONGODB_URI in Render to switch this on (same one used for accounts/orders).

const memProducts = new Map()

const seed = [
  { name: 'Digital Air Fryer 5.5L', category: 'kitchen-appliances', price: 45000, stock: 5, image: 'https://images.unsplash.com/photo-1648301037182-9dd1ad3c4d90?w=800', description: 'Oil-free frying, digital touch panel, 8 preset programs, 5.5L family-size basket.' },
  { name: 'High-Speed Blender 1200W', category: 'kitchen-appliances', price: 32000, stock: 5, image: 'https://images.unsplash.com/photo-1585237672814-8f97e97ae7d5?w=800', description: 'Crushes ice, blends smoothies, and grinds spices with a 1200W motor.' },
  { name: 'Electric Kettle 1.8L', category: 'kitchen-appliances', price: 15000, stock: 5, image: 'https://images.unsplash.com/photo-1594213465100-0c5a4a4b5c4a?w=800', description: 'Rapid boil, auto shut-off, stainless steel interior.' },
  { name: 'Electric Pepper & Tomato Grinder', category: 'kitchen-appliances', price: 28000, stock: 5, image: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=800', description: 'Built for Nigerian kitchens — grinds pepper and tomato fast, heavy-duty motor.' },
  { name: 'Sandwich Press & Grill', category: 'kitchen-appliances', price: 18000, stock: 5, image: 'https://images.unsplash.com/photo-1619740455993-9f6b53f7e5ef?w=800', description: 'Non-stick plates, even heating, compact footprint.' },
  { name: 'Smart LED Desk Lamp', category: 'electronics', price: 12000, stock: 8, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800', description: 'Touch dimming, USB charging port, three color temperature modes.' },
  { name: 'Bluetooth Speaker Pro', category: 'electronics', price: 22000, stock: 8, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800', description: 'Deep bass, 12-hour battery, splash resistant.' },
  { name: 'Smart Power Strip (Wi-Fi)', category: 'electronics', price: 14000, stock: 8, image: 'https://images.unsplash.com/photo-1620293023555-2b3e6b5f5e5e?w=800', description: 'Control outlets from your phone, surge protection, 4 sockets.' },
  { name: 'Mechanical Keyboard RGB', category: 'laptop-desktop-gadgets', price: 35000, stock: 6, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800', description: 'Hot-swappable switches, per-key RGB, USB-C detachable cable.' },
  { name: 'USB-C Docking Station 8-in-1', category: 'laptop-desktop-gadgets', price: 26000, stock: 6, image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=800', description: 'HDMI, USB 3.0 x3, SD card reader, 100W power delivery passthrough.' },
  { name: 'Laptop Cooling Stand', category: 'laptop-desktop-gadgets', price: 16000, stock: 6, image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800', description: 'Dual quiet fans, adjustable height, fits up to 17-inch laptops.' },
  { name: 'Wireless Ergonomic Mouse', category: 'laptop-desktop-gadgets', price: 13000, stock: 6, image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800', description: 'Silent clicks, 2.4GHz + Bluetooth dual mode, rechargeable.' },
]

function buildSeedProducts() {
  const featuredIndexes = [0, 1, 5, 6, 8, 9]
  return seed.map((p, i) => {
    const id = nanoid(8)
    const { image, ...rest } = p
    return {
      id,
      featured: featuredIndexes.includes(i),
      images: [image],
      keywords: [],
      weight: null,
      sku: '',
      brand: '',
      keyFeatures: [],
      ...rest,
    }
  })
}

// In-memory fallback is always seeded immediately so the site works
// out of the box even with no database configured.
buildSeedProducts().forEach((p) => memProducts.set(p.id, p))

// Called once after a successful MongoDB connection — seeds the starter
// catalog into the real database, but only if it's empty (won't overwrite
// products you've already added or edited).
export async function seedProductsIfEmpty() {
  if (!isDBConnected()) return
  const count = await Product.countDocuments()
  if (count > 0) return
  await Product.insertMany(buildSeedProducts())
  console.log('[db] Seeded starter product catalog into MongoDB')
}

export async function getAllProducts() {
  if (isDBConnected()) return Product.find().lean()
  return [...memProducts.values()]
}

export async function getProduct(id) {
  if (isDBConnected()) return Product.findOne({ id }).lean()
  return memProducts.get(id) || null
}

export async function createProduct(data) {
  const id = nanoid(8)
  const product = { id, featured: false, ...data }
  if (isDBConnected()) {
    const created = await Product.create(product)
    return created.toObject()
  }
  memProducts.set(id, product)
  return product
}

export async function updateProduct(id, data) {
  if (isDBConnected()) {
    return Product.findOneAndUpdate({ id }, { $set: data }, { new: true }).lean()
  }
  const existing = memProducts.get(id)
  if (!existing) return null
  const updated = { ...existing, ...data, id }
  memProducts.set(id, updated)
  return updated
}

export async function deleteProduct(id) {
  if (isDBConnected()) {
    const result = await Product.deleteOne({ id })
    return result.deletedCount > 0
  }
  return memProducts.delete(id)
}
