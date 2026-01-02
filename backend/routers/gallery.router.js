const express = require('express')
const router = express.Router()
const galleryController = require('../controllers/gallery.controller')
const { authenticate } = require('../middlewares/auth.middleware')
const { upload } = require('../middlewares/upload.middleware')
const asyncHandler = require('../utils/asyncHandler')

// Public routes
router.get('/', asyncHandler(galleryController.getAllImages))
router.get('/stats', asyncHandler(galleryController.getStats))
router.get('/:id', asyncHandler(galleryController.getImageById))

// Protected routes (require authentication)
router.use(authenticate)

router.post('/', upload.single('image'), asyncHandler(galleryController.uploadImage))
router.put('/:id', asyncHandler(galleryController.updateImage))
router.delete('/:id', asyncHandler(galleryController.deleteImage))
router.post('/:id/like', asyncHandler(galleryController.toggleLike))
router.post('/:id/comments', asyncHandler(galleryController.addComment))
router.delete('/:id/comments/:commentId', asyncHandler(galleryController.deleteComment))

module.exports = router
