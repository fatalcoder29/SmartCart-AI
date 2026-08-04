const express = require('express')
const { getDashboardAnalytics } = require('../controllers/analyticsController')
const { protect, admin } = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/dashboard', protect, admin, getDashboardAnalytics)

module.exports = router
