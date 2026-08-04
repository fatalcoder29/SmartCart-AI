const express = require('express')
const { createPaymentOrder, verifyPayment, handleWebhook } = require('../controllers/paymentController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/create-order', protect, createPaymentOrder)
router.post('/verify', protect, verifyPayment)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook)

module.exports = router
