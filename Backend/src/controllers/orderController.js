const asyncHandler = require('../utils/asyncHandler')
const ApiError = require('../utils/ApiError')
const Order = require('../models/Order')

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    idempotencyKey,
  } = req.body

  if (!orderItems || orderItems.length === 0) {
    throw new ApiError(400, 'No order items provided in request.')
  }

  if (!shippingAddress || !shippingAddress.street || !shippingAddress.city) {
    throw new ApiError(400, 'Please provide a valid shipping address.')
  }

  // Idempotency check to prevent duplicate order creations
  if (idempotencyKey) {
    const existingOrder = await Order.findOne({ idempotencyKey })
    if (existingOrder) {
      return res.status(200).json({
        success: true,
        message: 'Order retrieved via idempotency key',
        order: existingOrder,
      })
    }
  }

  const order = new Order({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod: paymentMethod || 'Razorpay',
    itemsPrice,
    taxPrice: taxPrice || 0,
    shippingPrice: shippingPrice || 0,
    totalPrice,
    isPaid: false, // Strictly false until verified
    status: 'Created',
    idempotencyKey,
  })

  const createdOrder = await order.save()

  res.status(201).json({
    success: true,
    message: 'Order created successfully. Proceed to payment.',
    order: createdOrder,
  })
})

// @desc    Cancel order (Customer)
// @route   POST /api/v1/orders/:id/cancel
// @access  Private
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (!order) {
    throw new ApiError(404, 'Order not found.')
  }

  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized to cancel this order.')
  }

  if (['Shipped', 'Delivered'].includes(order.status)) {
    throw new ApiError(400, `Cannot cancel an order that is already ${order.status}.`)
  }

  order.status = 'Cancelled'
  await order.save()

  res.status(200).json({
    success: true,
    message: 'Order cancelled successfully',
    order,
  })
})

// @desc    Get order details by ID
// @route   GET /api/v1/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email')

  if (!order) {
    throw new ApiError(404, `Order not found with ID: ${req.params.id}`)
  }

  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized to view this order.')
  }

  res.status(200).json({
    success: true,
    order,
  })
})

// @desc    Get logged-in user's order history
// @route   GET /api/v1/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })

  res.status(200).json({
    success: true,
    count: orders.length,
    orders,
  })
})

// @desc    Get all orders (Admin)
// @route   GET /api/v1/orders
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate('user', 'id name email')
    .sort({ createdAt: -1 })

  res.status(200).json({
    success: true,
    count: orders.length,
    orders,
  })
})

// @desc    Update order status (Admin)
// @route   PUT /api/v1/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body
  const order = await Order.findById(req.params.id)

  if (!order) {
    throw new ApiError(404, 'Order not found.')
  }

  if (status) {
    order.status = status
    if (status === 'Delivered') {
      order.isDelivered = true
      order.deliveredAt = Date.now()
    }
  }

  const updatedOrder = await order.save()

  res.status(200).json({
    success: true,
    message: 'Order status updated successfully',
    order: updatedOrder,
  })
})

module.exports = {
  createOrder,
  cancelOrder,
  getOrderById,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
}
