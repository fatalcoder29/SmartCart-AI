require('dotenv').config({ path: require('path').join(__dirname, '../../.env') })
const mongoose = require('mongoose')
const Product = require('../models/Product')

const seedProducts = [
  {
    name: 'Oslo Wool Coat',
    price: 420,
    category: 'outerwear',
    tag: 'New',
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=800&q=80',
    description: 'Double-breasted wool coat in a warm charcoal melange. Fully lined, horn buttons, cut for layering without bulk.',
    details: ['100% merino wool', 'Made in Oslo', 'Dry clean only', 'Model wears size M'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: 20,
  },
  {
    name: 'Cashmere Crew',
    price: 186,
    category: 'knitwear',
    tag: null,
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80',
    description: 'Lightweight crew-neck knit in Grade-A cashmere. Ribbed cuffs and hem, relaxed fit for everyday wear.',
    details: ['Grade-A cashmere', 'Ribbed trim', 'Hand-finished seams', 'Machine wash cold'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: 15,
  },
  {
    name: 'Saddle Crossbody',
    price: 245,
    category: 'leather',
    tag: 'Limited',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
    description: 'Compact crossbody in vegetable-tanned leather. Brushed brass hardware, interior card pocket, adjustable strap.',
    details: ['Vegetable-tanned leather', 'Brass hardware', 'Adjustable strap', 'Made in Portugal'],
    sizes: ['One size'],
    stock: 10,
  },
  {
    name: 'Nordic Loafer',
    price: 198,
    category: 'footwear',
    tag: null,
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
    description: 'Minimal leather loafer with a low stacked heel. Cushioned insole, Blake-stitched sole for durability.',
    details: ['Full-grain leather upper', 'Leather sole', 'Cushioned insole', 'Made in Italy'],
    sizes: ['39', '40', '41', '42', '43', '44'],
    stock: 12,
  },
  {
    name: 'Merino Scarf',
    price: 98,
    category: 'knitwear',
    tag: null,
    image: 'https://images.unsplash.com/photo-1608256246200-53bd7f3c1c6e?auto=format&fit=crop&w=800&q=80',
    description: 'Generous merino scarf in a soft heather grey. Lightweight warmth without itch, finished with hand-rolled edges.',
    details: ['100% merino wool', 'Hand-rolled edges', '200 × 40 cm', 'Dry flat'],
    sizes: ['One size'],
    stock: 30,
  },
  {
    name: 'Structured Blazer',
    price: 340,
    category: 'outerwear',
    tag: 'New',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6aae4?auto=format&fit=crop&w=800&q=80',
    description: 'Tailored blazer in brushed cotton twill. Single-button closure, notch lapel, half-canvas construction.',
    details: ['Cotton twill blend', 'Half-canvas construction', 'Two interior pockets', 'Dry clean'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: 8,
  },
  {
    name: 'Leather Belt',
    price: 78,
    category: 'leather',
    tag: null,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    description: 'Classic belt in full-grain leather with a matte buckle. Ages naturally with wear.',
    details: ['Full-grain leather', 'Matte buckle', '3.2 cm width', 'Cut to size available'],
    sizes: ['80', '85', '90', '95', '100'],
    stock: 25,
  },
  {
    name: 'Silk Pocket Square',
    price: 52,
    category: 'objects',
    tag: null,
    image: 'https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?auto=format&fit=crop&w=800&q=80',
    description: 'Printed silk pocket square in muted terracotta tones. Hand-rolled hem, suitable for jacket or bag accent.',
    details: ['100% silk', 'Hand-rolled hem', '32 × 32 cm', 'Made in Como'],
    sizes: ['One size'],
    stock: 40,
  },
  {
    name: 'Weekender Bag',
    price: 320,
    category: 'leather',
    tag: 'Limited',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    description: 'Overnight bag in pebbled leather with canvas lining. Top zip, exterior slip pocket, detachable shoulder strap.',
    details: ['Pebbled leather', 'Canvas lining', 'Brass zip', '45 × 28 × 18 cm'],
    sizes: ['One size'],
    stock: 6,
  },
  {
    name: 'Cotton Oxford Shirt',
    price: 128,
    category: 'knitwear',
    tag: null,
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80',
    description: 'Oxford cloth button-down in off-white. Mother-of-pearl buttons, curved hem, classic relaxed fit.',
    details: ['100% cotton oxford', 'Mother-of-pearl buttons', 'Curved hem', 'Machine wash cold'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: 18,
  },
  {
    name: 'Chelsea Boot',
    price: 265,
    category: 'footwear',
    tag: 'New',
    image: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=800&q=80',
    description: 'Pull-on Chelsea boot in polished leather. Elastic side panels, leather sole, Goodyear welted construction.',
    details: ['Polished leather', 'Goodyear welt', 'Leather sole', 'Made in Spain'],
    sizes: ['39', '40', '41', '42', '43', '44'],
    stock: 14,
  },
  {
    name: 'Studio Ceramic Vase',
    price: 68,
    category: 'objects',
    tag: null,
    image: 'https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?auto=format&fit=crop&w=800&q=80',
    description: 'Hand-thrown stoneware vase in a matte sand glaze. Each piece is unique with subtle variation in tone.',
    details: ['Stoneware', 'Matte glaze', 'H 22 cm', 'Handmade in Denmark'],
    sizes: ['One size'],
    stock: 22,
  },
]

const runSeed = async (mongoURI) => {
  try {
    await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 10000 })
    console.log('[Seed] Connected to MongoDB')

    // Delete all existing products
    await Product.deleteMany({})
    console.log('[Seed] Cleared existing products')

    // Generate slug + sku before insert (insertMany skips pre-save hooks)
    const productsToInsert = seedProducts.map((p, i) => {
      const slug = p.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        + '-' + (Date.now() + i) // ensure uniqueness

      const sku = `SKU-${slug.split('-').slice(0, 2).join('-').toUpperCase()}-${i + 1}`
      return { ...p, slug, sku, isActive: true }
    })

    const inserted = await Product.insertMany(productsToInsert, { ordered: true })
    console.log(`[Seed] ✅ ${inserted.length} products seeded successfully!`)
    await mongoose.disconnect()
    process.exit(0)
  } catch (error) {
    console.error(`[Seed] ❌ Error: ${error.message}`)
    process.exit(1)
  }
}

if (process.argv[2] === '-i') {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai_ecommerce'
  console.log(`[Seed] Connecting to: ${uri.includes('mongodb+srv') ? 'MongoDB Atlas' : 'Local MongoDB'}`)
  runSeed(uri)
}

module.exports = { seedProducts, runSeed }
