const cloudinary = require('../configs/cloudinary.config')
const sharp = require('sharp')

/**
 * Nén và resize ảnh
 * @param {Buffer} buffer - File buffer
 * @returns {Promise<Buffer>} - Ảnh đã nén
 */
const compressImage = async (buffer) => {
    try {
        return await sharp(buffer)
            .resize(1920, 1920, {
                // Giữ tỷ lệ, không vượt quá 1920px
                fit: 'inside',
                withoutEnlargement: true,
            })
            .jpeg({ quality: 70 }) // Nén 70%
            .toBuffer()
    } catch (error) {
        console.error('Error compressing image:', error)
        // Nếu lỗi thì trả về buffer gốc
        return buffer
    }
}

/**
 * Upload file lên Cloudinary từ buffer với tên file custom
 * @param {Buffer} buffer - File buffer từ multer
 * @param {string} publicId - Tên file (VD: trongandev, trongandev-project-0)
 * @param {string} folder - Thư mục trên Cloudinary
 * @returns {Promise<string>} - URL của ảnh
 */
const uploadToCloudinary = async (buffer, publicId, folder = 'mindx-teaching') => {
    try {
        // Nén ảnh trước khi upload
        const compressedBuffer = await compressImage(buffer)

        return new Promise((resolve, reject) => {
            cloudinary.uploader
                .upload_stream(
                    {
                        folder: folder,
                        public_id: publicId,
                        overwrite: true, // Ghi đè nếu đã tồn tại
                        resource_type: 'auto',
                        format: 'jpg', // Convert sang jpg để tối ưu
                    },
                    (error, result) => {
                        if (error) {
                            reject(error)
                        } else {
                            resolve(result.secure_url)
                        }
                    }
                )
                .end(compressedBuffer)
        })
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error)
        throw error
    }
}

/**
 * Xóa ảnh từ Cloudinary dựa vào public_id
 * @param {string} publicId - Public ID (VD: mindx-teaching/trongandev)
 * @returns {Promise<void>}
 */
const deleteFromCloudinary = async (publicId) => {
    if (!publicId) return

    try {
        await cloudinary.uploader.destroy(publicId)
        console.log(`Deleted image from Cloudinary: ${publicId}`)
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error)
        // Không throw error để không làm gián đoạn flow update
    }
}

/**
 * Extract public_id từ Cloudinary URL
 * @param {string} imageUrl - URL của ảnh
 * @returns {string|null} - Public ID hoặc null
 */
const getPublicIdFromUrl = (imageUrl) => {
    if (!imageUrl || !imageUrl.includes('cloudinary.com')) {
        return null
    }

    try {
        const urlParts = imageUrl.split('/')
        const versionIndex = urlParts.findIndex((part) => part.startsWith('v'))

        if (versionIndex === -1) return null

        const pathAfterVersion = urlParts.slice(versionIndex + 1)
        const publicIdWithExt = pathAfterVersion.join('/')
        const publicId = publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf('.'))

        return publicId
    } catch (error) {
        console.error('Error extracting public_id:', error)
        return null
    }
}

module.exports = {
    uploadToCloudinary,
    deleteFromCloudinary,
    getPublicIdFromUrl,
    compressImage,
}
