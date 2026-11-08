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
  { name: "Aerion 14 Ultrabook · i5 / 16GB / 512GB", category: "laptop", sub: "laptop", brand: "Aerion", price: 685000, stock: 8, weight: 1.4, description: "Slim 14-inch ultrabook with a bright FHD display, all-day battery and a backlit keyboard — built for work, school and travel." },
  { name: "Voltix Pro 15.6\" · Ryzen 7 / 16GB / 1TB", category: "laptop", sub: "laptop", brand: "Voltix", price: 890000, stock: 5, weight: 1.8, description: "Performance laptop for creators and developers with a fast 8-core processor, 1TB NVMe storage and a colour-accurate screen." },
  { name: "Nexa Air 13 · M-class / 8GB / 256GB", category: "laptop", sub: "laptop", brand: "Nexa", price: 1150000, stock: 3, weight: 1.2, description: "Ultra-light premium laptop with a fanless design, razor-sharp display and 18-hour battery life." },
  { name: "Zenith Student 15 · Core i3 / 8GB / 256GB", category: "laptop", sub: "laptop", brand: "Zenith", price: 345000, stock: 14, weight: 1.7, description: "Reliable everyday laptop for students and small offices. Light on price, strong on essentials." },
  { name: "Quanta Flex 2-in-1 Touch · i5 / 16GB", category: "laptop", sub: "laptop", brand: "Quanta", price: 740000, stock: 0, weight: 1.5, description: "360° hinge touchscreen laptop with stylus support for notes, sketching and presentations." },
  { name: "Pixelon Business 14 · i7 / 32GB / 1TB", category: "laptop", sub: "laptop", brand: "Pixelon", price: 1320000, stock: 4, weight: 1.4, description: "Business-grade laptop with fingerprint login, spill-resistant keyboard and a 3-year-ready chassis." },
  { name: "Laptop Sleeve 15.6\" · Water-Resistant", category: "laptop", sub: "laptop-accessories", brand: "Aerion", price: 12500, stock: 60, weight: 0.3, description: "Padded neoprene sleeve with a soft lining and an extra pocket for your charger." },
  { name: "USB-C Hub 7-in-1 · HDMI / USB 3.0 / SD", category: "laptop", sub: "laptop-accessories", brand: "Nexa", price: 24500, stock: 40, weight: 0.2, description: "Turn one USB-C port into HDMI 4K, three USB 3.0 ports, SD/microSD and 100W pass-through charging." },
  { name: "Laptop Cooling Pad · Dual Silent Fans", category: "laptop", sub: "laptop-accessories", brand: "Voltix", price: 18000, stock: 25, weight: 0.8, description: "Adjustable height cooling stand with two quiet fans and USB pass-through. Fits up to 17-inch laptops." },
  { name: "Aluminium Laptop Stand · Foldable", category: "laptop", sub: "laptop-accessories", brand: "Zenith", price: 16500, stock: 35, weight: 0.5, description: "Ergonomic foldable stand that lifts your screen to eye level. Packs flat for travel." },
  { name: "65W GaN Fast Charger · USB-C", category: "laptop", sub: "laptop-accessories", brand: "Quanta", price: 21000, stock: 50, weight: 0.2, description: "Compact GaN charger that powers laptops, tablets and phones at once. Over-heat and surge protected." },
  { name: "16GB DDR4 3200MHz SO-DIMM Laptop RAM", category: "laptop", sub: "laptop-parts", brand: "Pixelon", price: 38000, stock: 30, weight: 0.1, description: "Plug-and-play memory upgrade for faster multitasking on most DDR4 laptops." },
  { name: "512GB NVMe M.2 SSD · Gen3", category: "laptop", sub: "laptop-parts", brand: "Aerion", price: 46500, stock: 22, weight: 0.1, description: "Blazing storage upgrade — boots in seconds, reads up to 3,400MB/s. 5-year-ready endurance." },
  { name: "Replacement Laptop Battery · 15.6\" Class", category: "laptop", sub: "laptop-parts", brand: "Zenith", price: 52000, stock: 9, weight: 0.4, description: "High-capacity replacement battery with protection circuit. Confirm your model before ordering." },
  { name: "15.6\" FHD Replacement Laptop Screen", category: "laptop", sub: "laptop-parts", brand: "Quanta", price: 68000, stock: 6, weight: 0.6, description: "1080p IPS replacement panel, 30-pin eDP. Match your model number before ordering." },
  { name: "Voltix Tower PC · i7 / 32GB / 1TB / GTX", category: "desktop", sub: "desktop", brand: "Voltix", price: 1380000, stock: 3, weight: 9.5, description: "Powerhouse tower for editing, rendering and gaming with a tempered-glass side panel and RGB cooling." },
  { name: "Zenith All-in-One 24\" · i5 / 16GB / 512GB", category: "desktop", sub: "desktop", brand: "Zenith", price: 780000, stock: 7, weight: 6.8, description: "Clean, space-saving all-in-one with a 24-inch FHD display, webcam and wireless keyboard + mouse." },
  { name: "Nexa Mini PC · Ryzen 5 / 16GB / 512GB", category: "desktop", sub: "desktop", brand: "Nexa", price: 495000, stock: 12, weight: 0.7, description: "Palm-sized PC that mounts behind a monitor. Perfect for office, POS and home-theatre use." },
  { name: "Pixelon Workstation · Xeon / 64GB / 2TB", category: "desktop", sub: "desktop", brand: "Pixelon", price: 2450000, stock: 2, weight: 11.2, description: "Workstation-class desktop for 3D, CAD and heavy compute with ECC-ready memory and pro graphics." },
  { name: "27\" QHD 144Hz Monitor · IPS", category: "desktop", sub: "desktop-accessories", brand: "Aerion", price: 285000, stock: 11, weight: 5.2, description: "Smooth 144Hz, 1ms response, 99% sRGB. Equally good for gaming and design." },
  { name: "1080p Webcam · Auto-Focus + Mic", category: "desktop", sub: "desktop-accessories", brand: "Quanta", price: 28000, stock: 45, weight: 0.2, description: "Crisp video calls with noise-reducing mic and a privacy shutter." },
  { name: "Wireless Keyboard & Mouse Combo", category: "desktop", sub: "desktop-accessories", brand: "Zenith", price: 19500, stock: 55, weight: 0.6, description: "Quiet, full-size keys and a precise optical mouse on one USB receiver." },
  { name: "Dual Monitor Arm · Gas Spring", category: "desktop", sub: "desktop-accessories", brand: "Nexa", price: 42000, stock: 15, weight: 3.1, description: "Free up your desk. Full tilt/swivel/rotate for two screens up to 32 inches." },
  { name: "8GB GDDR6 Graphics Card · Dual Fan", category: "desktop", sub: "desktop-parts", brand: "Voltix", price: 520000, stock: 4, weight: 1.1, description: "Ray-tracing-ready graphics card for 1440p gaming and GPU-accelerated creative apps." },
  { name: "650W 80+ Gold Modular PSU", category: "desktop", sub: "desktop-parts", brand: "Pixelon", price: 78000, stock: 18, weight: 1.6, description: "Efficient, quiet and fully modular for neat builds. 10-year ready protection suite." },
  { name: "32GB (2×16GB) DDR4 3600MHz RGB Kit", category: "desktop", sub: "desktop-parts", brand: "Aerion", price: 95000, stock: 20, weight: 0.2, description: "Matched pair of overclock-ready DIMMs with addressable RGB lighting." },
  { name: "1TB NVMe Gen4 SSD · Heatsink", category: "desktop", sub: "desktop-parts", brand: "Quanta", price: 88000, stock: 26, weight: 0.1, description: "Read speeds up to 7,000MB/s with a built-in heatsink for sustained performance." },
  { name: "Pulse Smartwatch · AMOLED / GPS", category: "tech-gadgets", sub: "", brand: "Nexa", price: 58000, stock: 30, weight: 0.1, description: "Bright AMOLED, heart-rate and sleep tracking, GPS and 10-day battery." },
  { name: "AirBuds ANC · Wireless Earbuds", category: "tech-gadgets", sub: "", brand: "Aerion", price: 36500, stock: 48, weight: 0.1, description: "Active noise cancelling, 30-hour case battery and low-latency mode." },
  { name: "PowerCore 20,000mAh Power Bank · 65W", category: "tech-gadgets", sub: "", brand: "Voltix", price: 39000, stock: 36, weight: 0.5, description: "Charges a laptop, phone and watch at once. Two USB-C ports and a LED display." },
  { name: "Smart Bulb 4-Pack · Wi-Fi RGB", category: "tech-gadgets", sub: "", brand: "Zenith", price: 22000, stock: 0, weight: 0.4, description: "App and voice control, 16 million colours and schedules. Works with major assistants." },
  { name: "Portable SSD 1TB · USB-C 1,050MB/s", category: "tech-gadgets", sub: "", brand: "Pixelon", price: 74000, stock: 17, weight: 0.1, description: "Pocket-size rugged storage with hardware encryption support." },
  { name: "LED Ring Light 12\" + Tripod", category: "tech-gadgets", sub: "", brand: "Quanta", price: 17500, stock: 33, weight: 1.2, description: "Studio-quality lighting for calls, content and product shots. Three colour temperatures." },
  { name: "Wireless Gaming Controller · Hall Sensors", category: "gaming-gadgets", sub: "", brand: "Voltix", price: 34500, stock: 21, weight: 0.3, description: "Drift-free sticks, 40-hour battery and programmable back paddles. PC, Android and console ready." },
  { name: "7.1 Surround Gaming Headset · Detachable Mic", category: "gaming-gadgets", sub: "", brand: "Aerion", price: 31000, stock: 27, weight: 0.4, description: "Memory-foam ear cups, 50mm drivers and a broadcast-quality boom mic." },
  { name: "RGB Mechanical Gaming Keyboard · Hot-Swap", category: "gaming-gadgets", sub: "", brand: "Zenith", price: 44500, stock: 16, weight: 0.9, description: "Hot-swappable switches, per-key RGB and a detachable USB-C cable." },
  { name: "Ultralight Gaming Mouse · 26K DPI", category: "gaming-gadgets", sub: "", brand: "Nexa", price: 26500, stock: 40, weight: 0.1, description: "Ultra-light 58g shell, optical switches and a 70-hour wireless battery." },
  { name: "XXL Desk Mat · 900×400mm Stitched", category: "gaming-gadgets", sub: "", brand: "Pixelon", price: 11500, stock: 70, weight: 0.4, description: "Smooth cloth surface, anti-slip base and stitched edges. Covers your keyboard and mouse." },
  { name: "Streaming Mic Kit · USB Condenser + Arm", category: "gaming-gadgets", sub: "", brand: "Quanta", price: 38500, stock: 0, weight: 1, description: "Cardioid condenser mic with a boom arm, pop filter and one-touch mute." },
]

function buildSeedProducts() {
  const featuredIndexes = [1, 2, 8, 22, 27, 28, 36]
  return seed.map((p, i) => {
    const id = nanoid(8)
    const { image, ...rest } = p
    return {
      id,
      featured: featuredIndexes.includes(i),
      images: image ? [image] : [],
      keywords: [],
      sku: '',
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
