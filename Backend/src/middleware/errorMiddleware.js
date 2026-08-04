const ApiError = require('../utils/ApiError')

const errorMiddleware = (err, req, res, next) => {
  let error = { ...err }
  error.message = err.message || 'Internal Server Error'
  error.statusCode = err.statusCode || 500

  // Mongoose invalid ObjectId error
  if (err.name === 'CastError') {
    const message = `Resource not found. Invalid ID format: ${err.value}`
    error = new ApiError(400, message)
  }

  // Mongoose duplicate key error (e.g. duplicate email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue).join(', ')
    const message = `Duplicate value entered for '${field}' field.`
    error = new ApiError(400, message)
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message).join(', ')
    error = new ApiError(400, message)
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new ApiError(401, 'Invalid authentication token. Please log in again.')
  }

  if (err.name === 'TokenExpiredError') {
    error = new ApiError(401, 'Authentication token expired. Please log in again.')
  }

  res.status(error.statusCode || 500).json({
    success: false,
    statusCode: error.statusCode || 500,
    message: error.message,
    errors: error.errors || [],
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  })
}

// 404 Not Found Middleware
const notFound = (req, res, next) => {
  const error = new ApiError(404, `API Route Not Found - [${req.method}] ${req.originalUrl}`)
  next(error)
}

module.exports = { errorMiddleware, notFound }
