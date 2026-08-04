const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Upload buffer stream to Cloudinary
const uploadToCloudinary = (buffer, folder = 'maren_products') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [{ width: 1000, height: 1200, crop: 'limit', quality: 'auto' }],
      },
      (error, result) => {
        if (error) return reject(error)
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
        })
      }
    )
    uploadStream.end(buffer)
  })
}

// Delete asset from Cloudinary
const deleteFromCloudinary = async (public_id) => {
  if (!public_id) return
  try {
    await cloudinary.uploader.destroy(public_id)
  } catch (error) {
    console.error(`[Cloudinary Error] Failed to delete asset ${public_id}:`, error)
  }
}

module.exports = {
  cloudinary,
  uploadToCloudinary,
  deleteFromCloudinary,
}
