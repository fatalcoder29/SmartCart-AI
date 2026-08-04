const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: [0, 'Price must be positive'],
    },
    originalPrice: {
      type: Number,
      default: null,
    },
    discountPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      lowercase: true,
      trim: true,
    },
    brand: {
      type: String,
      default: 'Maren & Co',
      trim: true,
    },
    tag: { type: String, default: null, trim: true },
    isFeatured: { type: Boolean, default: false },

    // ── Images ────────────────────────────────────────────────────────────────
    image:    { type: String, required: [true, 'Please provide a product image'] },
    images:   [{ url: String, public_id: String }],
    public_id: { type: String, default: null },

    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    details:  { type: [String], default: [] },
    sizes:    { type: [String], default: ['S', 'M', 'L'] },
    colors:   { type: [String], default: [] },

    // ── Inventory ─────────────────────────────────────────────────────────────
    stock:       { type: Number, default: 0, min: [0, 'Stock cannot be negative'] },
    lowStockAlert: { type: Number, default: 5 },

    // ── Ratings ───────────────────────────────────────────────────────────────
    rating:     { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },

    // ── SEO ───────────────────────────────────────────────────────────────────
    metaTitle:       { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    keywords:        { type: [String], default: [] },

    // ── Misc ──────────────────────────────────────────────────────────────────
    user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    isActive:  { type: Boolean, default: true },
  },
  { timestamps: true }
)

// Auto-generate slug from name before save
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      + '-' + Date.now()
  }
  next()
})

// Text index for full-text search
productSchema.index({ name: 'text', description: 'text', category: 'text', brand: 'text' })
// Performance indexes
productSchema.index({ category: 1, price: 1 })
productSchema.index({ brand: 1 })
productSchema.index({ isFeatured: 1 })
productSchema.index({ rating: -1 })
productSchema.index({ createdAt: -1 })
productSchema.index({ stock: 1 })

module.exports = mongoose.model('Product', productSchema)
