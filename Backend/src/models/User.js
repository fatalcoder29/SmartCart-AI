const mongoose = require('mongoose')
const bcrypt   = require('bcryptjs')
const jwt      = require('jsonwebtoken')
const crypto   = require('crypto')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    phone: { type: String, default: '' },

    // ── Address ───────────────────────────────────────────────────────────────
    address: {
      street:     { type: String, default: '' },
      city:       { type: String, default: '' },
      state:      { type: String, default: '' },
      postalCode: { type: String, default: '' },
      country:    { type: String, default: '' },
    },

    // ── Wishlist ──────────────────────────────────────────────────────────────
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],

    // ── Email Verification ────────────────────────────────────────────────────
    isEmailVerified:          { type: Boolean, default: false },
    emailVerificationToken:   { type: String, select: false },
    emailVerificationExpire:  { type: Date, select: false },

    // ── Password Reset ────────────────────────────────────────────────────────
    resetPasswordToken:  { type: String, select: false },
    resetPasswordExpire: { type: Date, select: false },

    // ── Refresh Token ─────────────────────────────────────────────────────────
    refreshToken:        { type: String, select: false },
    refreshTokenExpire:  { type: Date, select: false },

    // ── Account Lockout (brute-force protection) ──────────────────────────────
    loginAttempts: { type: Number, default: 0 },
    lockUntil:     { type: Date, default: null },

    // ── Profile ───────────────────────────────────────────────────────────────
    avatar: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

// ─── Pre-save: Hash password ───────────────────────────────────────────────
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(12)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// ─── Instance Methods ──────────────────────────────────────────────────────

// Compare entered password to hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

// Generate short-lived access token (15 minutes)
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET || 'fallback_access_secret',
    { expiresIn: '15m' }
  )
}

// Generate long-lived refresh token (7 days) and save hash to DB
userSchema.methods.generateRefreshToken = function () {
  const token = jwt.sign(
    { id: this._id },
    process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret',
    { expiresIn: '7d' }
  )
  this.refreshToken       = token
  this.refreshTokenExpire = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  return token
}

// Legacy — keep for backward compatibility during migration
userSchema.methods.generateAuthToken = function () {
  return this.generateAccessToken()
}

// Generate email verification token
userSchema.methods.generateEmailVerificationToken = function () {
  const token = crypto.randomBytes(32).toString('hex')
  this.emailVerificationToken  = crypto.createHash('sha256').update(token).digest('hex')
  this.emailVerificationExpire = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  return token // send raw token in email
}

// Generate password reset token
userSchema.methods.generateResetPasswordToken = function () {
  const token = crypto.randomBytes(32).toString('hex')
  this.resetPasswordToken  = crypto.createHash('sha256').update(token).digest('hex')
  this.resetPasswordExpire = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
  return token
}

// Check if account is locked
userSchema.methods.isLocked = function () {
  return this.lockUntil && this.lockUntil > Date.now()
}

// Increment login attempts — lock after 5 failures for 30 minutes
userSchema.methods.incrementLoginAttempts = async function () {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    // Lock expired — reset
    this.loginAttempts = 1
    this.lockUntil     = null
  } else {
    this.loginAttempts += 1
    if (this.loginAttempts >= 5 && !this.isLocked()) {
      this.lockUntil = new Date(Date.now() + 30 * 60 * 1000) // 30-min lockout
    }
  }
  return this.save()
}

// Indexes
userSchema.index({ resetPasswordToken: 1 })
userSchema.index({ emailVerificationToken: 1 })

module.exports = mongoose.model('User', userSchema)
