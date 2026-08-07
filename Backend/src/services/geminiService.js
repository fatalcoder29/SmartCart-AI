const { GoogleGenerativeAI } = require('@google/generative-ai')

// Validate API key — must be non-empty and not a placeholder
// Google AI Studio issues keys starting with AIzaSy... OR AQ... — both are valid
const isValidKey = (key) => {
  if (!key || typeof key !== 'string') return false
  const k = key.trim()
  return k.length > 20 && !k.includes('your_gemini') && !k.includes('your_key')
}

// Try models in order of preference
const MODELS = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-pro']

const getGeminiModel = () => {
  const apiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : ''
  if (!isValidKey(apiKey)) return null
  const genAI = new GoogleGenerativeAI(apiKey)
  return genAI.getGenerativeModel({ model: MODELS[0] })
}

// Test Endpoint Service — tries each model until one works
const testGeminiConnection = async () => {
  const apiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : ''

  if (!isValidKey(apiKey)) {
    throw new Error('GEMINI_API_KEY is missing or set to placeholder. Add your key from aistudio.google.com/app/apikey')
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  let lastError = null

  for (const modelName of MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName })
      const result = await model.generateContent('Say Hello from Gemini API')
      const response = await result.response
      const text = response.text().trim()
      console.log(`[Gemini] Connected using model: ${modelName}`)
      return text
    } catch (err) {
      console.warn(`[Gemini] Model ${modelName} failed: ${err.message}`)
      lastError = err
    }
  }

  throw lastError
}

// 1. AI Shopping Assistant Chat Completion
const chatWithAssistant = async (message, contextProducts = []) => {
  const model = getGeminiModel()
  const productContextText = contextProducts
    .map((p) => `- ${p.name} (${p.category}, ₹${p.price}): ${p.description}`)
    .join('\n')

  const prompt = `You are SmartCart AI, an expert, polite, and stylish AI Shopping Assistant for a luxury e-commerce platform.
Product Catalog Context:
${productContextText || 'Standard catalogue available: Wool Coats, Cashmere Knits, Leather Goods, Footwear.'}

User Query: "${message}"

Respond concisely and helpful in markdown format. Recommend matching products when appropriate.`

  if (!model) {
    return `**SmartCart AI**: Thank you for asking! I recommend looking at our **Oslo Wool Coat** and **Cashmere Crew** for timeless elegance. *(Note: Add your GEMINI_API_KEY in Backend/.env for live Google Gemini AI completions)*`
  }

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error('[Gemini AI Error]:', error.message)
    return `I am currently updating my style recommendations. Please browse our latest outerwear and knitwear collections!`
  }
}

// 2. AI Product Description Generator (For Admin)
const generateProductDescription = async (productName, category = '') => {
  const model = getGeminiModel()
  const prompt = `Generate a compelling, high-converting product description, key highlights, and SEO tags for a product named "${productName}" in category "${category}".
Format JSON response with keys:
- description: detailed product copy (2 paragraphs)
- highlights: array of 4 bullet points
- metaTitle: SEO title
- metaDescription: SEO meta description (max 150 chars)
- keywords: array of 5 SEO keywords`

  if (!model) {
    return {
      description: `Crafted with premium materials, the ${productName} combines Scandinavian minimalist aesthetic with functional everyday elegance.`,
      highlights: ['Premium materials', 'Tailored fit', 'Durable craftsmanship', 'Modern design'],
      metaTitle: `${productName} | SmartCart AI`,
      metaDescription: `Shop the elegant ${productName}. Premium quality and luxury design.`,
      keywords: [productName, category, 'luxury', 'fashion', 'minimalist'],
    }
  }

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text().replace(/```json|```/g, '').trim()
    return JSON.parse(text)
  } catch {
    return {
      description: `The ${productName} represents master craftsmanship and clean minimalist design.`,
      highlights: ['Master craftsmanship', 'Sustainable fabrics', 'Tailored fit'],
      metaTitle: `${productName} | SmartCart AI`,
      metaDescription: `Discover ${productName} in our luxury collection.`,
      keywords: [productName, category, 'style'],
    }
  }
}

// 3. AI Review Summarizer
const summarizeReviews = async (reviews = []) => {
  if (reviews.length === 0) return 'No customer reviews yet.'

  const model = getGeminiModel()
  const reviewTexts = reviews.map((r) => `[${r.rating} stars] ${r.comment}`).join('\n')
  const prompt = `Summarize the overall customer sentiment from these reviews into 3 concise bullet points:\n${reviewTexts}`

  if (!model) {
    return 'Customers consistently praise the premium material quality, exceptional fit, and fast delivery.'
  }

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch {
    return 'Overall customer feedback highlights great product craftsmanship and true-to-size fitting.'
  }
}

// 4. AI Smart Natural Language Search
const translateNaturalSearch = async (userQuery) => {
  const model = getGeminiModel()
  const prompt = `Translate this user shopping search query into key terms and category filters: "${userQuery}".
Return JSON object with keys: "keywords" (string), "category" (string or null), "maxPrice" (number or null).`

  if (!model) {
    return { keywords: userQuery, category: null, maxPrice: null }
  }

  try {
    const result = await model.generateContent(prompt)
    const text = (await result.response).text().replace(/```json|```/g, '').trim()
    return JSON.parse(text)
  } catch {
    return { keywords: userQuery, category: null, maxPrice: null }
  }
}

module.exports = {
  testGeminiConnection,
  chatWithAssistant,
  generateProductDescription,
  summarizeReviews,
  translateNaturalSearch,
}
