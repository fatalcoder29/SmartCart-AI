const asyncHandler = require('../utils/asyncHandler')
const ApiError = require('../utils/ApiError')
const Product = require('../models/Product')
const Review = require('../models/Review')
const {
  testGeminiConnection,
  chatWithAssistant,
  generateProductDescription,
  summarizeReviews,
  translateNaturalSearch,
} = require('../services/geminiService')

// @desc    Test Gemini API Connection
// @route   GET /api/v1/ai/test
// @access  Public
const handleAITest = asyncHandler(async (req, res) => {
  try {
    const aiMessage = await testGeminiConnection()
    res.status(200).json({
      success: true,
      message: aiMessage,
    })
  } catch (error) {
    let cause = 'Unknown error'
    let fix = 'Check your API Key and network connection.'

    if (error.status === 429 || error.message?.includes('429') || error.message?.includes('Quota')) {
      cause = 'HTTP 429 Quota Exceeded / Rate Limit'
      fix = 'The Google Gemini API free tier rate limit or daily request quota for this key has been reached. Please wait 1 minute for rate limit reset, or generate a new key at https://aistudio.google.com/app/apikey.'
    } else if (error.status === 400 || error.status === 403 || error.message?.includes('API_KEY_INVALID') || error.message?.includes('API key not valid')) {
      cause = 'Invalid Google Gemini API Key'
      fix = 'The GEMINI_API_KEY in Backend/.env is invalid. Create a free API key at https://aistudio.google.com/app/apikey and paste it into Backend/.env.'
    } else if (error.message?.includes('missing')) {
      cause = 'Missing GEMINI_API_KEY'
      fix = 'Add GEMINI_API_KEY=your_key to Backend/.env.'
    } else {
      cause = error.message
    }

    res.status(500).json({
      success: false,
      error: 'Gemini API Connection Failed',
      cause,
      details: error.message,
      fix,
    })
  }
})

// @desc    AI Shopping Assistant Chat Endpoint
// @route   POST /api/v1/ai/chat
// @access  Public
const handleAIChat = asyncHandler(async (req, res) => {
  const { message } = req.body
  if (!message) throw new ApiError(400, 'Message prompt is required.')

  const featuredProducts = await Product.find({ isActive: true }).limit(10).select('name category price description')
  const reply = await chatWithAssistant(message, featuredProducts)

  res.status(200).json({
    success: true,
    reply,
  })
})

// @desc    AI Product Description & SEO Generator (Admin)
// @route   POST /api/v1/ai/generate-description
// @access  Private/Admin
const handleGenerateDescription = asyncHandler(async (req, res) => {
  const { productName, category } = req.body
  if (!productName) throw new ApiError(400, 'Product name is required.')

  const generated = await generateProductDescription(productName, category)
  res.status(200).json({
    success: true,
    data: generated,
  })
})

// @desc    AI Review Summarizer
// @route   GET /api/v1/ai/summary/:productId
// @access  Public
const handleSummarizeReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId }).limit(20)
  const summary = await summarizeReviews(reviews)

  res.status(200).json({
    success: true,
    summary,
  })
})

// @desc    AI Smart Search Query Processing
// @route   GET /api/v1/ai/search
// @access  Public
const handleAISmartSearch = asyncHandler(async (req, res) => {
  const { q } = req.query
  if (!q) throw new ApiError(400, 'Search query query parameter (q) is required.')

  const parsed = await translateNaturalSearch(q)
  const queryObj = { isActive: true }

  if (parsed.keywords) {
    queryObj.$or = [
      { name: { $regex: parsed.keywords, $options: 'i' } },
      { description: { $regex: parsed.keywords, $options: 'i' } },
    ]
  }
  if (parsed.category) {
    queryObj.category = parsed.category.toLowerCase()
  }

  const products = await Product.find(queryObj).limit(20)

  res.status(200).json({
    success: true,
    count: products.length,
    parsedQuery: parsed,
    products,
  })
})

module.exports = {
  handleAITest,
  handleAIChat,
  handleGenerateDescription,
  handleSummarizeReviews,
  handleAISmartSearch,
}
