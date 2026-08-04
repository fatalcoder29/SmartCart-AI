const express = require('express')
const {
  createOrder,
  cancelOrder,
  getOrderById,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController')
const { protect, admin } = require('../middleware/authMiddleware')

const router = express.Router()

router
  .route('/')
  .post(protect, createOrder)
  .get(protect, admin, getAllOrders)

router.get('/myorders', protect, getMyOrders)
router.get('/:id', protect, getOrderById)
router.post('/:id/cancel', protect, cancelOrder)
router.put('/:id/status', protect, admin, updateOrderStatus)

module.exports = router
