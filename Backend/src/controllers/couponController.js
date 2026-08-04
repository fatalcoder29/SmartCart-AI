const asyncHandler = require('../utils/asyncHandler')
const ApiError = require('../utils/ApiError')
const Coupon = require('../models/Coupon')

// @desc    Validate and apply coupon code
// @route   POST /api/v1/coupons/validate
// @access  Private
const validateCoupon = asyncHandler(async (req, res) => {
  const { code, cartTotal } = req.body

  if (!code) {
    throw new ApiError(400, 'Please provide a coupon code.')
  }

  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true })
  if (!coupon) {
    throw new ApiError(404, 'Invalid or expired coupon code.')
  }

  if (coupon.expiresAt && coupon.expiresAt < Date.now()) {
    throw new ApiError(400, 'This coupon code has expired.')
  }

  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    throw new ApiError(400, 'Coupon usage limit reached.')
  }

  if (cartTotal < coupon.minPurchaseAmount) {
    throw new ApiError(400, `Minimum purchase of ₹${coupon.minPurchaseAmount} required for this coupon.`)
  }

  let discount = 0
  if (coupon.discountType === 'percentage') {
    discount = (cartTotal * coupon.discountValue) / 100
    if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
      discount = coupon.maxDiscountAmount
    }
  } else {
    discount = coupon.discountValue
  }

  res.status(200).json({
    success: true,
    message: 'Coupon applied successfully!',
    coupon: {
      _id: coupon._id,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      calculatedDiscount: Math.round(discount),
    },
  })
})

// @desc    Get all coupons (Admin)
// @route   GET /api/v1/coupons
// @access  Private/Admin
const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find({}).sort({ createdAt: -1 })
  res.status(200).json({ success: true, count: coupons.length, coupons })
})

// @desc    Create new coupon (Admin)
// @route   POST /api/v1/coupons
// @access  Private/Admin
const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create(req.body)
  res.status(201).json({ success: true, message: 'Coupon created successfully', coupon })
})

// @desc    Delete coupon (Admin)
// @route   DELETE /api/v1/coupons/:id
// @access  Private/Admin
const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id)
  if (!coupon) throw new ApiError(404, 'Coupon not found')
  await coupon.deleteOne()
  res.status(200).json({ success: true, message: 'Coupon deleted' })
})

module.exports = {
  validateCoupon,
  getCoupons,
  createCoupon,
  deleteCoupon,
}
