const multer = require('multer')
const ApiError = require('../utils/ApiError')

// Configure Memory Storage for Buffer processing
const storage = multer.memoryStorage()

// File Filter for Image validation
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new ApiError(400, 'Unsupported file format. Please upload an image file (jpg, png, webp).'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
})

module.exports = upload
