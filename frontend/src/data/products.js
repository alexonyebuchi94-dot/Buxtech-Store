// New placeholder catalog (old kitchen/electronics stock removed).
// Swap names, prices and photos for real stock when ready — every product's
// `images` array can hold real URLs instead of the generated placeholder art.
import { art } from '../lib/placeholder.js'

export const categories = [
  {
    slug: 'laptop', name: 'Laptop', kind: 'laptop',
    subs: [
      { slug: 'laptop', name: 'Laptop' },
      { slug: 'laptop-accessories', name: 'Laptop Accessories' },
      { slug: 'laptop-parts', name: 'Laptop Parts' },
    ],
  },
  {
    slug: 'desktop', name: 'Desktop', kind: 'desktop',
    subs: [
      { slug: 'desktop', name: 'Desktop' },
      { slug: 'desktop-accessories', name: 'Desktop Accessories' },
      { slug: 'desktop-parts', name: 'Desktop Parts' },
    ],
  },
  { slug: 'tech-gadgets', name: 'Tech Gadgets', kind: 'gadget', subs: [] },
  { slug: 'gaming-gadgets', name: 'Gaming Gadgets', kind: 'gaming', subs: [] },
]

export const catName = (slug) => categories.find((c) => c.slug === slug)?.name || slug
export const subName = (cat, sub) => categories.find((c) => c.slug === cat)?.subs.find((s) => s.slug === sub)?.name

// [name, category, sub, brand, price, oldPrice, stock, rating, reviews, daysOld, popularity, kg, description]
const RAW = [
  ['Aerion 14 Ultrabook · i5 / 16GB / 512GB', 'laptop', 'laptop', 'Aerion', 685000, 760000, 8, 4.7, 128, 3, 96, 1.4, 'Slim 14-inch ultrabook with a bright FHD display, all-day battery and a backlit keyboard — built for work, school and travel.'],
  ['Voltix Pro 15.6" · Ryzen 7 / 16GB / 1TB', 'laptop', 'laptop', 'Voltix', 890000, 0, 5, 4.8, 94, 6, 90, 1.8, 'Performance laptop for creators and developers with a fast 8-core processor, 1TB NVMe storage and a colour-accurate screen.'],
  ['Nexa Air 13 · M-class / 8GB / 256GB', 'laptop', 'laptop', 'Nexa', 1150000, 1240000, 3, 4.9, 211, 11, 99, 1.2, 'Ultra-light premium laptop with a fanless design, razor-sharp display and 18-hour battery life.'],
  ['Zenith Student 15 · Core i3 / 8GB / 256GB', 'laptop', 'laptop', 'Zenith', 345000, 0, 14, 4.2, 156, 40, 82, 1.7, 'Reliable everyday laptop for students and small offices. Light on price, strong on essentials.'],
  ['Quanta Flex 2-in-1 Touch · i5 / 16GB', 'laptop', 'laptop', 'Quanta', 740000, 810000, 0, 4.5, 63, 22, 60, 1.5, '360° hinge touchscreen laptop with stylus support for notes, sketching and presentations.'],
  ['Pixelon Business 14 · i7 / 32GB / 1TB', 'laptop', 'laptop', 'Pixelon', 1320000, 0, 4, 4.6, 41, 55, 48, 1.4, 'Business-grade laptop with fingerprint login, spill-resistant keyboard and a 3-year-ready chassis.'],

  ['Laptop Sleeve 15.6" · Water-Resistant', 'laptop', 'laptop-accessories', 'Aerion', 12500, 15000, 60, 4.4, 88, 5, 70, 0.3, 'Padded neoprene sleeve with a soft lining and an extra pocket for your charger.'],
  ['USB-C Hub 7-in-1 · HDMI / USB 3.0 / SD', 'laptop', 'laptop-accessories', 'Nexa', 24500, 29000, 40, 4.6, 173, 2, 92, 0.2, 'Turn one USB-C port into HDMI 4K, three USB 3.0 ports, SD/microSD and 100W pass-through charging.'],
  ['Laptop Cooling Pad · Dual Silent Fans', 'laptop', 'laptop-accessories', 'Voltix', 18000, 0, 25, 4.3, 77, 18, 58, 0.8, 'Adjustable height cooling stand with two quiet fans and USB pass-through. Fits up to 17-inch laptops.'],
  ['Aluminium Laptop Stand · Foldable', 'laptop', 'laptop-accessories', 'Zenith', 16500, 19500, 35, 4.5, 59, 9, 64, 0.5, 'Ergonomic foldable stand that lifts your screen to eye level. Packs flat for travel.'],
  ['65W GaN Fast Charger · USB-C', 'laptop', 'laptop-accessories', 'Quanta', 21000, 0, 50, 4.7, 204, 30, 88, 0.2, 'Compact GaN charger that powers laptops, tablets and phones at once. Over-heat and surge protected.'],

  ['16GB DDR4 3200MHz SO-DIMM Laptop RAM', 'laptop', 'laptop-parts', 'Pixelon', 38000, 42000, 30, 4.8, 112, 7, 85, 0.1, 'Plug-and-play memory upgrade for faster multitasking on most DDR4 laptops.'],
  ['512GB NVMe M.2 SSD · Gen3', 'laptop', 'laptop-parts', 'Aerion', 46500, 0, 22, 4.7, 134, 15, 87, 0.1, 'Blazing storage upgrade — boots in seconds, reads up to 3,400MB/s. 5-year-ready endurance.'],
  ['Replacement Laptop Battery · 15.6" Class', 'laptop', 'laptop-parts', 'Zenith', 52000, 0, 9, 4.1, 36, 48, 35, 0.4, 'High-capacity replacement battery with protection circuit. Confirm your model before ordering.'],
  ['15.6" FHD Replacement Laptop Screen', 'laptop', 'laptop-parts', 'Quanta', 68000, 75000, 6, 4.3, 22, 33, 28, 0.6, '1080p IPS replacement panel, 30-pin eDP. Match your model number before ordering.'],

  ['Voltix Tower PC · i7 / 32GB / 1TB / GTX', 'desktop', 'desktop', 'Voltix', 1380000, 1500000, 3, 4.8, 52, 8, 80, 9.5, 'Powerhouse tower for editing, rendering and gaming with a tempered-glass side panel and RGB cooling.'],
  ['Zenith All-in-One 24" · i5 / 16GB / 512GB', 'desktop', 'desktop', 'Zenith', 780000, 0, 7, 4.5, 38, 26, 55, 6.8, 'Clean, space-saving all-in-one with a 24-inch FHD display, webcam and wireless keyboard + mouse.'],
  ['Nexa Mini PC · Ryzen 5 / 16GB / 512GB', 'desktop', 'desktop', 'Nexa', 495000, 540000, 12, 4.6, 71, 14, 72, 0.7, 'Palm-sized PC that mounts behind a monitor. Perfect for office, POS and home-theatre use.'],
  ['Pixelon Workstation · Xeon / 64GB / 2TB', 'desktop', 'desktop', 'Pixelon', 2450000, 0, 2, 4.9, 17, 60, 30, 11.2, 'Workstation-class desktop for 3D, CAD and heavy compute with ECC-ready memory and pro graphics.'],

  ['27" QHD 144Hz Monitor · IPS', 'desktop', 'desktop-accessories', 'Aerion', 285000, 320000, 11, 4.7, 98, 4, 91, 5.2, 'Smooth 144Hz, 1ms response, 99% sRGB. Equally good for gaming and design.'],
  ['1080p Webcam · Auto-Focus + Mic', 'desktop', 'desktop-accessories', 'Quanta', 28000, 0, 45, 4.4, 121, 12, 74, 0.2, 'Crisp video calls with noise-reducing mic and a privacy shutter.'],
  ['Wireless Keyboard & Mouse Combo', 'desktop', 'desktop-accessories', 'Zenith', 19500, 23000, 55, 4.3, 190, 21, 83, 0.6, 'Quiet, full-size keys and a precise optical mouse on one USB receiver.'],
  ['Dual Monitor Arm · Gas Spring', 'desktop', 'desktop-accessories', 'Nexa', 42000, 0, 15, 4.6, 33, 37, 40, 3.1, 'Free up your desk. Full tilt/swivel/rotate for two screens up to 32 inches.'],

  ['8GB GDDR6 Graphics Card · Dual Fan', 'desktop', 'desktop-parts', 'Voltix', 520000, 575000, 4, 4.7, 44, 10, 77, 1.1, 'Ray-tracing-ready graphics card for 1440p gaming and GPU-accelerated creative apps.'],
  ['650W 80+ Gold Modular PSU', 'desktop', 'desktop-parts', 'Pixelon', 78000, 0, 18, 4.8, 66, 19, 61, 1.6, 'Efficient, quiet and fully modular for neat builds. 10-year ready protection suite.'],
  ['32GB (2×16GB) DDR4 3600MHz RGB Kit', 'desktop', 'desktop-parts', 'Aerion', 95000, 108000, 20, 4.8, 82, 16, 79, 0.2, 'Matched pair of overclock-ready DIMMs with addressable RGB lighting.'],
  ['1TB NVMe Gen4 SSD · Heatsink', 'desktop', 'desktop-parts', 'Quanta', 88000, 0, 26, 4.9, 109, 28, 86, 0.1, 'Read speeds up to 7,000MB/s with a built-in heatsink for sustained performance.'],

  ['Pulse Smartwatch · AMOLED / GPS', 'tech-gadgets', '', 'Nexa', 58000, 69000, 30, 4.4, 167, 1, 90, 0.1, 'Bright AMOLED, heart-rate and sleep tracking, GPS and 10-day battery.'],
  ['AirBuds ANC · Wireless Earbuds', 'tech-gadgets', '', 'Aerion', 36500, 42000, 48, 4.5, 231, 4, 95, 0.1, 'Active noise cancelling, 30-hour case battery and low-latency mode.'],
  ['PowerCore 20,000mAh Power Bank · 65W', 'tech-gadgets', '', 'Voltix', 39000, 0, 36, 4.7, 188, 9, 93, 0.5, 'Charges a laptop, phone and watch at once. Two USB-C ports and a LED display.'],
  ['Smart Bulb 4-Pack · Wi-Fi RGB', 'tech-gadgets', '', 'Zenith', 22000, 26000, 0, 4.2, 74, 24, 50, 0.4, 'App and voice control, 16 million colours and schedules. Works with major assistants.'],
  ['Portable SSD 1TB · USB-C 1,050MB/s', 'tech-gadgets', '', 'Pixelon', 74000, 0, 17, 4.8, 96, 13, 81, 0.1, 'Pocket-size rugged storage with hardware encryption support.'],
  ['LED Ring Light 12" + Tripod', 'tech-gadgets', '', 'Quanta', 17500, 21000, 33, 4.3, 142, 17, 78, 1.2, 'Studio-quality lighting for calls, content and product shots. Three colour temperatures.'],

  ['Wireless Gaming Controller · Hall Sensors', 'gaming-gadgets', '', 'Voltix', 34500, 39000, 21, 4.6, 118, 2, 89, 0.3, 'Drift-free sticks, 40-hour battery and programmable back paddles. PC, Android and console ready.'],
  ['7.1 Surround Gaming Headset · Detachable Mic', 'gaming-gadgets', '', 'Aerion', 31000, 0, 27, 4.5, 154, 5, 85, 0.4, 'Memory-foam ear cups, 50mm drivers and a broadcast-quality boom mic.'],
  ['RGB Mechanical Gaming Keyboard · Hot-Swap', 'gaming-gadgets', '', 'Zenith', 44500, 52000, 16, 4.7, 207, 7, 94, 0.9, 'Hot-swappable switches, per-key RGB and a detachable USB-C cable.'],
  ['Ultralight Gaming Mouse · 26K DPI', 'gaming-gadgets', '', 'Nexa', 26500, 0, 40, 4.6, 176, 11, 87, 0.1, 'Ultra-light 58g shell, optical switches and a 70-hour wireless battery.'],
  ['XXL Desk Mat · 900×400mm Stitched', 'gaming-gadgets', '', 'Pixelon', 11500, 14000, 70, 4.4, 99, 23, 66, 0.4, 'Smooth cloth surface, anti-slip base and stitched edges. Covers your keyboard and mouse.'],
  ['Streaming Mic Kit · USB Condenser + Arm', 'gaming-gadgets', '', 'Quanta', 38500, 0, 0, 4.5, 58, 29, 52, 1.0, 'Cardioid condenser mic with a boom arm, pop filter and one-touch mute.'],
]

const HUES = { laptop: 200, desktop: 255, 'tech-gadgets': 175, 'gaming-gadgets': 285 }
const kindOf = (cat, sub) => (sub?.includes('parts') ? 'part' : sub?.includes('accessories') ? 'acc' : categories.find((c) => c.slug === cat)?.kind || 'gadget')
const FEATURES = {
  laptop: ['Genuine, factory-sealed', 'Fast Lagos & nationwide delivery', 'Free setup guidance on WhatsApp'],
  desktop: ['Tested before dispatch', 'Fast Lagos & nationwide delivery', 'Free setup guidance on WhatsApp'],
  'tech-gadgets': ['Original packaging', 'Fast Lagos & nationwide delivery', 'Easy exchange if faulty'],
  'gaming-gadgets': ['Tournament-grade build', 'Fast Lagos & nationwide delivery', 'Easy exchange if faulty'],
}
const DAY = 86400000

export const products = RAW.map((r, i) => {
  const [name, category, sub, brand, price, oldPrice, stock, rating, reviewCount, daysOld, popularity, weight, description] = r
  const kind = kindOf(category, sub)
  const hue = HUES[category] + (i % 5) * 6
  const images = [0, 1, 2, 3].map((v) => art(name.split('·')[0].trim(), kind, hue, v))
  return {
    id: `bx-${String(i + 1).padStart(3, '0')}`,
    name, category, sub, brand, price, oldPrice: oldPrice || null, stock, rating, reviewCount,
    createdAt: new Date(Date.now() - daysOld * DAY).toISOString(),
    popularity, weight, description,
    keyFeatures: [`Brand: ${brand} · 12-month warranty`, ...FEATURES[category]],
    warranty: '12 months', sku: `BX-${1000 + i}`,
    keywords: [brand, category, sub].filter(Boolean),
    images, image: images[0], featured: popularity >= 88,
  }
})

export const brands = [...new Set(products.map((p) => p.brand))].sort()
export const getProductSync = (id) => products.find((p) => p.id === id)

export const testimonials = [
  { name: 'Chiamaka O.', quote: 'Ordered my ultrabook on a Monday and had it by Wednesday. Packaging was solid and it runs perfectly.', location: 'Lagos' },
  { name: 'Tunde A.', quote: 'Best price I found for a USB-C hub anywhere online. Support replied the same day when I had a question.', location: 'Ibadan' },
  { name: 'Ifeoma K.', quote: 'The gaming keyboard is a beast. Exactly as described, delivery was fast and tracking actually worked.', location: 'Abuja' },
]
