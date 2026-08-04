const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true, default: 1 },
        size: { type: String, default: 'M' },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
      },
    ],
    shippingAddress: {
      street:     { type: String, required: true },
      city:       { type: String, required: true },
      postalCode: { type: String, required: true },
      country:    { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
      default: 'Razorpay',
    },

    // ── Razorpay ──────────────────────────────────────────────────────────────
    razorpayOrderId:   { type: String, default: null },
    razorpayPaymentId: { type: String, default: null },
    razorpaySignature: { type: String, default: null },

    // ── Coupon ────────────────────────────────────────────────────────────────
    coupon:         { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon', default: null },
    couponCode:     { type: String, default: null },
    discountAmount: { type: Number, default: 0 },

    // ── Pricing ───────────────────────────────────────────────────────────────
    itemsPrice:    { type: Number, required: true, default: 0 },
    taxPrice:      { type: Number, required: true, default: 0 },
    shippingPrice: { type: Number, required: true, default: 0 },
    totalPrice:    { type: Number, required: true, default: 0 },

    // ── Payment State ─────────────────────────────────────────────────────────
    // FIXED: was incorrectly defaulting to true — orders must NOT be marked paid
    // until Razorpay signature is verified on the server
    isPaid:   { type: Boolean, required: true, default: false },
    paidAt:   { type: Date },

    // ── Delivery State ────────────────────────────────────────────────────────
    isDelivered:  { type: Boolean, required: true, default: false },
    deliveredAt:  { type: Date },

    // ── Order Status Machine ──────────────────────────────────────────────────
    // Created → Pending (payment initiated) → Paid → Processing → Shipped → Delivered
    // Any state → Cancelled | Failed | Refunded
    status: {
      type: String,
      enum: ['Created', 'Pending', 'Paid', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Failed', 'Refunded'],
      default: 'Created',
    },

    trackingNumber: {
      type: String,
      default: () => 'SC-' + Math.floor(100000000 + Math.random() * 900000000),
    },

    // Idempotency key — prevents duplicate orders from double-submit
    idempotencyKey: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
)

// Index for fast user order lookups
orderSchema.index({ user: 1, createdAt: -1 })
orderSchema.index({ razorpayOrderId: 1 })
orderSchema.index({ status: 1 })

module.exports = mongoose.model('Order', orderSchema)
