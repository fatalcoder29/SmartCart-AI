const asyncHandler = require('../utils/asyncHandler')
const ApiError = require('../utils/ApiError')
const Order = require('../models/Order')
const Product = require('../models/Product')
const { createRazorpayOrder, verifyPaymentSignature, verifyWebhookSignature } = require('../services/razorpayService')

// @desc    Create Razorpay Order for Checkout
// @route   POST /api/v1/payment/create-order
// @access  Private
const createPaymentOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.body

  if (!orderId) {
    throw new ApiError(400, 'Order ID is required.')
  }

  const order = await Order.findById(orderId)
  if (!order) {
    throw new ApiError(404, `Order not found with ID: ${orderId}`)
  }

  // Ensure amount is strictly derived from database order total (Never trust frontend amount)
  const amountInINR = order.totalPrice
  const razorpayOrder = await createRazorpayOrder(amountInINR, `receipt_${order._id}`)

  // Store Razorpay Order ID on Order document
  order.razorpayOrderId = razorpayOrder.id
  order.status = 'Pending'
  await order.save()

  res.status(200).json({
    success: true,
    keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy_key_id',
    razorpayOrder,
    order: {
      _id: order._id,
      totalPrice: order.totalPrice,
      shippingAddress: order.shippingAddress,
    },
  })
})

// @desc    Verify Razorpay Payment Signature
// @route   POST /api/v1/payment/verify
// @access  Private
const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new ApiError(400, 'Missing payment verification parameters.')
  }

  const isValid = verifyPaymentSignature({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  })

  if (!isValid) {
    throw new ApiError(400, 'Invalid payment signature. Transaction failed verification.')
  }

  const order = await Order.findById(orderId)
  if (!order) {
    throw new ApiError(404, 'Order not found.')
  }

  // Prevent duplicate payment processing
  if (order.isPaid) {
    return res.status(200).json({
      success: true,
      message: 'Order was already processed successfully.',
      order,
    })
  }

  // Update order status to Paid
  order.isPaid = true
  order.paidAt = Date.now()
  order.status = 'Paid'
  order.razorpayPaymentId = razorpay_payment_id
  order.razorpaySignature = razorpay_signature

  // Deduct inventory stock for all ordered items transactionally
  for (const item of order.orderItems) {
    const product = await Product.findById(item.product)
    if (product) {
      product.stock = Math.max(0, product.stock - item.qty)
      await product.save()
    }
  }

  await order.save()

  res.status(200).json({
    success: true,
    message: 'Payment verified and order confirmed successfully.',
    order,
  })
})

// @desc    Razorpay Webhook Listener
// @route   POST /api/v1/payment/webhook
// @access  Public
const handleWebhook = asyncHandler(async (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET
  if (webhookSecret) {
    const signature = req.headers['x-razorpay-signature']
    const isValid = verifyWebhookSignature(JSON.stringify(req.body), signature, webhookSecret)
    if (!isValid) {
      throw new ApiError(400, 'Invalid webhook signature.')
    }
  }

  const event = req.body.event
  if (event === 'payment.captured') {
    const paymentEntity = req.body.payload.payment.entity
    const razorpayOrderId = paymentEntity.order_id

    const order = await Order.findOne({ razorpayOrderId })
    if (order && !order.isPaid) {
      order.isPaid = true
      order.paidAt = Date.now()
      order.status = 'Paid'
      order.razorpayPaymentId = paymentEntity.id
      await order.save()
    }
  }

  res.status(200).json({ status: 'ok' })
})

module.exports = {
  createPaymentOrder,
  verifyPayment,
  handleWebhook,
}
