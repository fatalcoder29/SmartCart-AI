const express = require('express')
const {
  getProducts,
  getProductById,
  createProductReview,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController')
const { protect, admin } = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadMiddleware')

const router = express.Router()

router
  .route('/')
  .get(getProducts)
  .post(protect, admin, upload.single('image'), createProduct)

router
  .route('/:id')
  .get(getProductById)
  .put(protect, admin, upload.single('image'), updateProduct)
  .delete(protect, admin, deleteProduct)

router.post('/:id/reviews', protect, createProductReview)

module.exports = router
