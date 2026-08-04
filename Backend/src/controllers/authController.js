const asyncHandler = require('../utils/asyncHandler')
const ApiError = require('../utils/ApiError')
const User = require('../models/User')
const sendEmail = require('../services/emailService')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

// Helper function to set Access & Refresh Tokens in HTTP-Only Cookies
const sendAuthTokenResponse = (user, statusCode, res, message = 'Success') => {
  const accessToken = user.generateAccessToken()
  const refreshToken = user.generateRefreshToken()

  // Save refresh token to user document
  user.save({ validateBeforeSave: false })

  const isProduction = process.env.NODE_ENV === 'production'

  // Access Token Cookie (15 mins)
  res.cookie('token', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000,
  })

  // Refresh Token Cookie (7 days)
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })

  res.status(statusCode).json({
    success: true,
    message,
    token: accessToken,
    refreshToken,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      address: user.address,
    },
  })
}

// @desc    Register new user & send email verification token
// @route   POST /api/v1/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    throw new ApiError(400, 'Please provide name, email, and password.')
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() })
  if (existingUser) {
    throw new ApiError(400, 'An account with this email address already exists.')
  }

  const user = new User({
    name,
    email: email.toLowerCase(),
    password,
    role: 'user',
  })

  const rawVerificationToken = user.generateEmailVerificationToken()
  await user.save()

  // Send Email Verification (async)
  const verifyUrl = `${process.env.CORS_ORIGIN || 'http://localhost:5173'}/verify-email?token=${rawVerificationToken}`
  try {
    await sendEmail({
      email: user.email,
      subject: 'Verify your SmartCart AI Account',
      html: `<h2>Welcome to SmartCart AI, ${user.name}!</h2><p>Please click the link below to verify your email address:</p><a href="${verifyUrl}">${verifyUrl}</a>`,
    })
  } catch (err) {
    console.warn('Verification email send failed:', err.message)
  }

  sendAuthTokenResponse(user, 201, res, 'Account registered successfully. Please verify your email.')
})

// @desc    Authenticate user & log in with brute-force lockout
// @route   POST /api/v1/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new ApiError(400, 'Please provide both email and password.')
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password +loginAttempts +lockUntil')
  if (!user) {
    throw new ApiError(401, 'Invalid credentials.')
  }

  // Check account lockout
  if (user.isLocked()) {
    throw new ApiError(423, 'Account is temporarily locked due to failed login attempts. Try again in 30 minutes.')
  }

  const isMatch = await user.matchPassword(password)
  if (!isMatch) {
    await user.incrementLoginAttempts()
    throw new ApiError(401, 'Invalid credentials.')
  }

  // Reset login attempts on success
  user.loginAttempts = 0
  user.lockUntil = null
  await user.save({ validateBeforeSave: false })

  sendAuthTokenResponse(user, 200, res, 'Logged in successfully')
})

// @desc    Verify email address token
// @route   POST /api/v1/auth/verify-email
// @access  Public
const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.body
  if (!token) throw new ApiError(400, 'Verification token is required.')

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpire: { $gt: Date.now() },
  })

  if (!user) {
    throw new ApiError(400, 'Invalid or expired email verification token.')
  }

  user.isEmailVerified = true
  user.emailVerificationToken = undefined
  user.emailVerificationExpire = undefined
  await user.save({ validateBeforeSave: false })

  res.status(200).json({
    success: true,
    message: 'Email address verified successfully!',
  })
})

// @desc    Send Forgot Password reset link email
// @route   POST /api/v1/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body
  if (!email) throw new ApiError(400, 'Please enter your email address.')

  const user = await User.findOne({ email: email.toLowerCase() })
  if (!user) {
    // Avoid user enumeration
    return res.status(200).json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.',
    })
  }

  const resetToken = user.generateResetPasswordToken()
  await user.save({ validateBeforeSave: false })

  const resetUrl = `${process.env.CORS_ORIGIN || 'http://localhost:5173'}/reset-password?token=${resetToken}`
  try {
    await sendEmail({
      email: user.email,
      subject: 'SmartCart AI Password Reset',
      html: `<p>You requested a password reset. Click the link below to set a new password:</p><a href="${resetUrl}">${resetUrl}</a><p>Token expires in 1 hour.</p>`,
    })
  } catch (err) {
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save({ validateBeforeSave: false })
    throw new ApiError(500, 'Failed to send password reset email.')
  }

  res.status(200).json({
    success: true,
    message: 'Password reset link sent to your email address.',
  })
})

// @desc    Reset password using token
// @route   POST /api/v1/auth/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body
  if (!token || !password) throw new ApiError(400, 'Token and new password are required.')

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  })

  if (!user) {
    throw new ApiError(400, 'Invalid or expired password reset token.')
  }

  user.password = password
  user.resetPasswordToken = undefined
  user.resetPasswordExpire = undefined
  await user.save()

  sendAuthTokenResponse(user, 200, res, 'Password reset successfully.')
})

// @desc    Refresh Access Token using Refresh Token
// @route   POST /api/v1/auth/refresh-token
// @access  Public
const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken || req.body.refreshToken

  if (!token) {
    throw new ApiError(401, 'No refresh token provided.')
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret')
    const user = await User.findById(decoded.id)

    if (!user || user.refreshToken !== token) {
      throw new ApiError(401, 'Invalid refresh token.')
    }

    sendAuthTokenResponse(user, 200, res, 'Token refreshed successfully')
  } catch (err) {
    throw new ApiError(401, 'Refresh token expired or invalid. Please log in again.')
  }
})

// @desc    Log user out & clear cookies
// @route   POST /api/v1/auth/logout
// @access  Public
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('token', '', { expires: new Date(0), httpOnly: true })
  res.cookie('refreshToken', '', { expires: new Date(0), httpOnly: true })

  if (req.user) {
    const user = await User.findById(req.user.id)
    if (user) {
      user.refreshToken = undefined
      user.refreshTokenExpire = undefined
      await user.save({ validateBeforeSave: false })
    }
  }

  res.status(200).json({ success: true, message: 'Logged out successfully' })
})

// @desc    Get current user profile
// @route   GET /api/v1/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
  res.status(200).json({ success: true, user })
})

module.exports = {
  registerUser,
  loginUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  refreshToken,
  logoutUser,
  getMe,
}
