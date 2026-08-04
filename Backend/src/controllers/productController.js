const asyncHandler = require('../utils/asyncHandler')
const ApiError = require('../utils/ApiError')
const Product = require('../models/Product')
const Review = require('../models/Review')
const mongoose = require('mongoose')
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary')

// Static fallback products dataset if database is offline or initializing
const fallbackProducts = [
  { _id: '1', id: '1', name: 'Oslo Wool Coat', price: 420, category: 'outerwear', brand: 'Maren & Co', tag: 'New', image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=800&q=80', description: 'Double-breasted wool coat in a warm charcoal melange.', sizes: ['S', 'M', 'L'], stock: 15 },
  { _id: '2', id: '2', name: 'Cashmere Crew', price: 186, category: 'knitwear', brand: 'Maren & Co', tag: null, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80', description: 'Lightweight crew-neck knit in Grade-A cashmere.', sizes: ['S', 'M', 'L'], stock: 20 },
  { _id: '3', id: '3', name: 'Saddle Crossbody', price: 245, category: 'leather', brand: 'Maren & Co', tag: 'Limited', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80', description: 'Compact crossbody in vegetable-tanned leather.', sizes: ['One size'], stock: 10 },
  { _id: '4', id: '4', name: 'Nordic Loafer', price: 198, category: 'footwear', brand: 'Maren & Co', tag: null, image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80', description: 'Minimal leather loafer with a low stacked heel.', sizes: ['40', '41', '42'], stock: 12 },
  { _id: '5', id: '5', name: 'Merino Scarf', price: 98, category: 'knitwear', brand: 'Maren & Co', tag: null, image: 'https://images.unsplash.com/photo-1608256246200-53bd7f3c1c6e?auto=format&fit=crop&w=800&q=80', description: 'Generous merino scarf in a soft heather grey.', sizes: ['One size'], stock: 30 },
  { _id: '6', id: '6', name: 'Structured Blazer', price: 340, category: 'outerwear', brand: 'Maren & Co', tag: 'New', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6aae4?auto=format&fit=crop&w=800&q=80', description: 'Tailored blazer in brushed cotton twill.', sizes: ['S', 'M', 'L'], stock: 8 },
]

// @desc    Get all products with filtering, search, brand, sorting & pagination
// @route   GET /api/v1/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const { category, brand, q, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query

  // If MongoDB is not connected (readyState !== 1), return static fallback gracefully
  if (mongoose.connection.readyState !== 1) {
    let filtered = [...fallbackProducts]
    if (category && category !== 'all') filtered = filtered.filter((p) => p.category === category.toLowerCase())
    if (q) filtered = filtered.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()))

    return res.status(200).json({
      success: true,
      count: filtered.length,
      pagination: { total: filtered.length, page: 1, pages: 1, limit: 12 },
      products: filtered,
      notice: 'Database connecting — serving static cached catalog.',
    })
  }

  const queryObj = { isActive: true }

  if (category && category !== 'all') {
    queryObj.category = category.toLowerCase()
  }

  if (brand && brand !== 'all') {
    queryObj.brand = { $regex: brand, $options: 'i' }
  }

  if (q) {
    queryObj.$or = [
      { name: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
      { category: { $regex: q, $options: 'i' } },
      { brand: { $regex: q, $options: 'i' } },
    ]
  }

  if (minPrice || maxPrice) {
    queryObj.price = {}
    if (minPrice) queryObj.price.$gte = Number(minPrice)
    if (maxPrice) queryObj.price.$lte = Number(maxPrice)
  }

  let sortOption = { createdAt: -1 }
  if (sort === 'price-asc') sortOption = { price: 1 }
  if (sort === 'price-desc') sortOption = { price: -1 }
  if (sort === 'rating') sortOption = { rating: -1 }
  if (sort === 'name') sortOption = { name: 1 }

  const pageNum = Number(page) || 1
  const limitNum = Number(limit) || 12
  const skip = (pageNum - 1) * limitNum

  try {
    const total = await Product.countDocuments(queryObj)
    const products = await Product.find(queryObj).sort(sortOption).skip(skip).limit(limitNum)

    res.status(200).json({
      success: true,
      count: products.length,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        limit: limitNum,
      },
      products,
    })
  } catch (err) {
    // Graceful fallback on query timeout
    res.status(200).json({
      success: true,
      count: fallbackProducts.length,
      pagination: { total: fallbackProducts.length, page: 1, pages: 1, limit: 12 },
      products: fallbackProducts,
      notice: 'Database query timeout — serving fallback catalog.',
    })
  }
})

// @desc    Get single product by ID
// @route   GET /api/v1/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    const found = fallbackProducts.find((p) => p.id === req.params.id || p._id === req.params.id) || fallbackProducts[0]
    return res.status(200).json({ success: true, product: found, reviews: [] })
  }

  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      const found = fallbackProducts.find((p) => p.id === req.params.id || p._id === req.params.id)
      if (found) return res.status(200).json({ success: true, product: found, reviews: [] })
      throw new ApiError(404, `Product not found with ID: ${req.params.id}`)
    }

    const reviews = await Review.find({ product: product._id }).sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      product,
      reviews,
    })
  } catch {
    const found = fallbackProducts.find((p) => p.id === req.params.id || p._id === req.params.id) || fallbackProducts[0]
    res.status(200).json({ success: true, product: found, reviews: [] })
  }
})

// @desc    Create product review & update overall rating
// @route   POST /api/v1/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body
  const product = await Product.findById(req.params.id)

  if (!product) {
    throw new ApiError(404, 'Product not found')
  }

  const alreadyReviewed = await Review.findOne({ product: product._id, user: req.user._id })
  if (alreadyReviewed) {
    throw new ApiError(400, 'You have already reviewed this product.')
  }

  const review = await Review.create({
    product: product._id,
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  })

  const reviews = await Review.find({ product: product._id })
  product.numReviews = reviews.length
  product.rating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length
  await product.save()

  res.status(201).json({
    success: true,
    message: 'Review submitted successfully',
    review,
  })
})

// @desc    Create new product (Admin)
// @route   POST /api/v1/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const { name, price, category, brand, tag, description, details, sizes, stock, image: imageBody } = req.body

  if (!name || !price || !category || !description) {
    throw new ApiError(400, 'Please provide name, price, category, and description.')
  }

  let imageUrl = imageBody || 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=800&q=80'
  let publicId = null

  if (req.file) {
    try {
      const uploaded = await uploadToCloudinary(req.file.buffer)
      imageUrl = uploaded.url
      publicId = uploaded.public_id
    } catch (err) {
      console.error('Cloudinary upload warning:', err.message)
    }
  }

  const product = await Product.create({
    name,
    price: Number(price),
    category,
    brand: brand || 'Maren & Co',
    tag: tag || null,
    image: imageUrl,
    public_id: publicId,
    description,
    details: Array.isArray(details) ? details : details ? details.split(',').map((d) => d.trim()) : [],
    sizes: Array.isArray(sizes) ? sizes : sizes ? sizes.split(',').map((s) => s.trim()) : ['S', 'M', 'L'],
    stock: stock !== undefined ? Number(stock) : 15,
    user: req.user ? req.user._id : undefined,
  })

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    product,
  })
})

// @desc    Update product (Admin)
// @route   PUT /api/v1/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id)
  if (!product) throw new ApiError(404, `Product not found with ID: ${req.params.id}`)

  if (req.file) {
    try {
      if (product.public_id) await deleteFromCloudinary(product.public_id)
      const uploaded = await uploadToCloudinary(req.file.buffer)
      req.body.image = uploaded.url
      req.body.public_id = uploaded.public_id
    } catch (err) {
      console.error('Cloudinary update warning:', err.message)
    }
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    message: 'Product updated successfully',
    product,
  })
})

// @desc    Delete product (Admin)
// @route   DELETE /api/v1/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product) throw new ApiError(404, `Product not found`)

  if (product.public_id) {
    await deleteFromCloudinary(product.public_id)
  }

  await product.deleteOne()

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully',
  })
})

module.exports = {
  getProducts,
  getProductById,
  createProductReview,
  createProduct,
  updateProduct,
  deleteProduct,
}
