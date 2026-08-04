const jwt = require('jsonwebtoken')
const asyncHandler = require('../utils/asyncHandler')
const ApiError = require('../utils/ApiError')
const User = require('../models/User')

// Middleware to protect routes and verify JWT token
const protect = asyncHandler(async (req, res, next) => {
  let token

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    throw new ApiError(401, 'Not authorized to access this route. Please log in.')
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_jwt_secret')
    req.user = await User.findById(decoded.id).select('-password')
    
    if (!req.user) {
      throw new ApiError(401, 'The user belonging to this token no longer exists.')
    }
    
    next()
  } catch (error) {
    throw new ApiError(401, 'Invalid authentication token. Authorization failed.')
  }
})

// Middleware to restrict access to Admin users only
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next()
  } else {
    throw new ApiError(403, 'Access denied. Administrator privileges required.')
  }
}

module.exports = { protect, admin }
