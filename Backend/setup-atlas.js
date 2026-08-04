/**
 * MongoDB Atlas Setup & Seed Script
 * Run: node setup-atlas.js <your-atlas-uri>
 * Or:  node setup-atlas.js  (reads from .env MONGO_URI)
 */

require('dotenv').config()
const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')

const atlasURI = process.argv[2] || process.env.MONGO_URI

if (!atlasURI || atlasURI.includes('127.0.0.1') || atlasURI.includes('localhost')) {
  console.log('')
  console.log('╔══════════════════════════════════════════════════════════════╗')
  console.log('║       MongoDB Atlas Connection Setup for SmartCart AI        ║')
  console.log('╠══════════════════════════════════════════════════════════════╣')
  console.log('║                                                              ║')
  console.log('║  Usage:                                                      ║')
  console.log('║    node setup-atlas.js "mongodb+srv://..."                   ║')
  console.log('║                                                              ║')
  console.log('║  How to get your Atlas URI in 5 minutes:                    ║')
  console.log('║  1. Go to https://www.mongodb.com/atlas/database             ║')
  console.log('║  2. Sign up (free) → Create Free M0 Cluster                 ║')
  console.log('║  3. Database Access → Add User → Copy username/password      ║')
  console.log('║  4. Network Access → Add IP → Allow from anywhere (0.0.0.0) ║')
  console.log('║  5. Cluster → Connect → Drivers → Copy the URI              ║')
  console.log('║  6. Run: node setup-atlas.js "mongodb+srv://..."             ║')
  console.log('║                                                              ║')
  console.log('╚══════════════════════════════════════════════════════════════╝')
  console.log('')
  process.exit(0)
}

const seedProducts = [
  { name: 'Oslo Wool Coat', price: 420, category: 'outerwear', tag: 'New', image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=800&q=80', description: 'Double-breasted wool coat in a warm charcoal melange. Fully lined, horn buttons, cut for layering without bulk.', details: ['100% merino wool', 'Made in Oslo', 'Dry clean only', 'Model wears size M'], sizes: ['XS', 'S', 'M', 'L', 'XL'], stock: 20 },
  { name: 'Cashmere Crew', price: 186, category: 'knitwear', tag: null, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80', description: 'Lightweight crew-neck knit in Grade-A cashmere. Ribbed cuffs and hem, relaxed fit for everyday wear.', details: ['Grade-A cashmere', 'Ribbed trim', 'Hand-finished seams', 'Machine wash cold'], sizes: ['XS', 'S', 'M', 'L', 'XL'], stock: 15 },
  { name: 'Saddle Crossbody', price: 245, category: 'leather', tag: 'Limited', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80', description: 'Compact crossbody in vegetable-tanned leather. Brushed brass hardware, interior card pocket, adjustable strap.', details: ['Vegetable-tanned leather', 'Brass hardware', 'Adjustable strap', 'Made in Portugal'], sizes: ['One size'], stock: 10 },
  { name: 'Nordic Loafer', price: 198, category: 'footwear', tag: null, image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80', description: 'Minimal leather loafer with a low stacked heel. Cushioned insole, Blake-stitched sole for durability.', details: ['Full-grain leather upper', 'Leather sole', 'Cushioned insole', 'Made in Italy'], sizes: ['39', '40', '41', '42', '43', '44'], stock: 12 },
  { name: 'Merino Scarf', price: 98, category: 'knitwear', tag: null, image: 'https://images.unsplash.com/photo-1608256246200-53bd7f3c1c6e?auto=format&fit=crop&w=800&q=80', description: 'Generous merino scarf in a soft heather grey. Lightweight warmth without itch, finished with hand-rolled edges.', details: ['100% merino wool', 'Hand-rolled edges', '200 × 40 cm', 'Dry flat'], sizes: ['One size'], stock: 30 },
  { name: 'Structured Blazer', price: 340, category: 'outerwear', tag: 'New', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6aae4?auto=format&fit=crop&w=800&q=80', description: 'Tailored blazer in brushed cotton twill. Single-button closure, notch lapel, half-canvas construction.', details: ['Cotton twill blend', 'Half-canvas construction', 'Two interior pockets', 'Dry clean'], sizes: ['XS', 'S', 'M', 'L', 'XL'], stock: 8 },
  { name: 'Leather Belt', price: 78, category: 'leather', tag: null, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80', description: 'Classic belt in full-grain leather with a matte buckle. Ages naturally with wear.', details: ['Full-grain leather', 'Matte buckle', '3.2 cm width', 'Cut to size available'], sizes: ['80', '85', '90', '95', '100'], stock: 25 },
  { name: 'Silk Pocket Square', price: 52, category: 'objects', tag: null, image: 'https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?auto=format&fit=crop&w=800&q=80', description: 'Printed silk pocket square in muted terracotta tones. Hand-rolled hem, suitable for jacket or bag accent.', details: ['100% silk', 'Hand-rolled hem', '32 × 32 cm', 'Made in Como'], sizes: ['One size'], stock: 40 },
  { name: 'Weekender Bag', price: 320, category: 'leather', tag: 'Limited', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80', description: 'Overnight bag in pebbled leather with canvas lining. Top zip, exterior slip pocket, detachable shoulder strap.', details: ['Pebbled leather', 'Canvas lining', 'Brass zip', '45 × 28 × 18 cm'], sizes: ['One size'], stock: 6 },
  { name: 'Cotton Oxford Shirt', price: 128, category: 'knitwear', tag: null, image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80', description: 'Oxford cloth button-down in off-white. Mother-of-pearl buttons, curved hem, classic relaxed fit.', details: ['100% cotton oxford', 'Mother-of-pearl buttons', 'Curved hem', 'Machine wash cold'], sizes: ['XS', 'S', 'M', 'L', 'XL'], stock: 18 },
  { name: 'Chelsea Boot', price: 265, category: 'footwear', tag: 'New', image: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=800&q=80', description: 'Pull-on Chelsea boot in polished leather. Elastic side panels, leather sole, Goodyear welted construction.', details: ['Polished leather', 'Goodyear welt', 'Leather sole', 'Made in Spain'], sizes: ['39', '40', '41', '42', '43', '44'], stock: 14 },
  { name: 'Studio Ceramic Vase', price: 68, category: 'objects', tag: null, image: 'https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?auto=format&fit=crop&w=800&q=80', description: 'Hand-thrown stoneware vase in a matte sand glaze. Each piece is unique with subtle variation in tone.', details: ['Stoneware', 'Matte glaze', 'H 22 cm', 'Handmade in Denmark'], sizes: ['One size'], stock: 22 },
]

async function setup() {
  console.log('')
  console.log('🔄 Connecting to MongoDB Atlas...')

  try {
    await mongoose.connect(atlasURI, { serverSelectionTimeoutMS: 15000 })
    console.log('✅ MongoDB Atlas Connected Successfully!')
    console.log(`   Database: ${mongoose.connection.name}`)
    console.log(`   Host:     ${mongoose.connection.host}`)
  } catch (err) {
    console.error('❌ Connection failed:', err.message)
    console.log('')
    console.log('Common issues:')
    console.log('  • Wrong username/password in the URI')
    console.log('  • IP address not whitelisted in Atlas Network Access')
    console.log('  • Cluster name or region typo')
    process.exit(1)
  }

  // Update .env file with the new URI
  const envPath = path.join(__dirname, '.env')
  let envContent = fs.readFileSync(envPath, 'utf-8')
  envContent = envContent.replace(
    /^MONGO_URI=.*$/m,
    `MONGO_URI=${atlasURI}`
  )
  fs.writeFileSync(envPath, envContent)
  console.log('✅ .env file updated with Atlas URI')

  // Define a quick inline schema to avoid importing full models
  const ProductSchema = new mongoose.Schema({ name: String, price: Number, category: String, tag: String, image: String, description: String, details: [String], sizes: [String], stock: Number }, { timestamps: true })
  const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema)

  // Check if products already exist
  const existingCount = await Product.countDocuments()
  if (existingCount > 0) {
    console.log(`✅ Database already has ${existingCount} products — skipping seed`)
  } else {
    console.log('🌱 Seeding 12 products into Atlas...')
    await Product.insertMany(seedProducts)
    console.log('✅ 12 products seeded successfully!')
  }

  await mongoose.disconnect()

  console.log('')
  console.log('╔══════════════════════════════════════════════════════════════╗')
  console.log('║               ✅ SETUP COMPLETE — YOU ARE READY!             ║')
  console.log('╠══════════════════════════════════════════════════════════════╣')
  console.log('║                                                              ║')
  console.log('║  Start your backend:                                         ║')
  console.log('║    cd Backend && npm run dev                                 ║')
  console.log('║                                                              ║')
  console.log('║  Start your frontend:                                        ║')
  console.log('║    cd Frontend && npm run dev                                ║')
  console.log('║                                                              ║')
  console.log('║  Open browser: http://localhost:5173                         ║')
  console.log('║                                                              ║')
  console.log('╚══════════════════════════════════════════════════════════════╝')
  console.log('')
}

setup()
