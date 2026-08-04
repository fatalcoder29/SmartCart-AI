const express = require('express')
const {
  handleAIChat,
  handleGenerateDescription,
  handleSummarizeReviews,
  handleAISmartSearch,
} = require('../controllers/aiController')
const { protect, admin } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/chat', handleAIChat)
router.post('/generate-description', protect, admin, handleGenerateDescription)
router.get('/summary/:productId', handleSummarizeReviews)
router.get('/search', handleAISmartSearch)

module.exports = router
