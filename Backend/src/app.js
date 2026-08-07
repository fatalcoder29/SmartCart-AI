const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const mongoSanitize = require('express-mongo-sanitize')
const hpp = require('hpp')
const compression = require('compression')
const morgan = require('morgan')

const { errorMiddleware, notFound } = require('./middleware/errorMiddleware')

// Import Routes
const authRoutes = require('./routes/authRoutes')
const productRoutes = require('./routes/productRoutes')
const orderRoutes = require('./routes/orderRoutes')
const paymentRoutes = require('./routes/paymentRoutes')
const couponRoutes = require('./routes/couponRoutes')
const aiRoutes = require('./routes/aiRoutes')
const analyticsRoutes = require('./routes/analyticsRoutes')

const app = express()

// 0. URL Normalizer Middleware (Converts leading double slashes e.g. //auth/register -> /auth/register)
app.use((req, res, next) => {
  if (req.url.startsWith('//')) {
    req.url = req.url.replace(/^\/+/, '/')
  }
  next()
})

// 1. Security HTTP Headers (Helmet)
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
)

// 2. Rate Limiting (100 requests per 15 mins for standard APIs)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
})
app.use('/api/v1', apiLimiter)

// Strict Rate Limiting for Auth Endpoints (20 requests per 15 mins)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many login/register attempts. Please try again in 15 minutes.' },
})
app.use('/api/v1/auth/login', authLimiter)
app.use('/api/v1/auth/register', authLimiter)
app.use('/auth/login', authLimiter)
app.use('/auth/register', authLimiter)

// 3. CORS Configuration
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true)
      }
      return callback(new Error(`CORS blocked request from origin: ${origin}`))
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
)

// 4. Request Body Parsers & Data Sanitization
app.use(express.json({ limit: '16kb' }))
app.use(express.urlencoded({ extended: true, limit: '16kb' }))
app.use(cookieParser())

// Prevent NoSQL query injection
app.use(mongoSanitize())

// Prevent HTTP Parameter Pollution
app.use(hpp({ whitelist: ['price', 'category', 'brand', 'rating', 'sort', 'page', 'limit'] }))

// Gzip Compression
app.use(compression())

// HTTP Request Logging in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Health Check Endpoints
app.get(['/api/v1/health', '/health'], (req, res) => {
  const dbState = mongoose.connection.readyState
  const dbStatusMap = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting',
  }

  res.status(200).json({
    success: true,
    message: 'SmartCart AI REST API Server Running Cleanly',
    database: {
      status: dbStatusMap[dbState] || 'Unknown',
      readyState: dbState,
    },
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  })
})

// Mount Primary API v1 Routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/products', productRoutes)
app.use('/api/v1/orders', orderRoutes)
app.use('/api/v1/payment', paymentRoutes)
app.use('/api/v1/coupons', couponRoutes)
app.use('/api/v1/ai', aiRoutes)
app.use('/api/v1/analytics', analyticsRoutes)

// Mount Alias Routes (Supports requests without /api/v1 prefix)
app.use('/auth', authRoutes)
app.use('/products', productRoutes)
app.use('/orders', orderRoutes)
app.use('/payment', paymentRoutes)
app.use('/coupons', couponRoutes)
app.use('/ai', aiRoutes)
app.use('/analytics', analyticsRoutes)

// 404 Route Handler
app.use(notFound)

// Centralized Global Error Handler
app.use(errorMiddleware)

module.exports = app
