const { GalleryModel } = require('../models/gallery.model')
const { MemberModel } = require('../models/user.model')
const cloudinary = require('../configs/cloudinary.config')
const { SuccessResponse } = require('../core/success.response')
const { BadRequestError, NotFoundError, ForbiddenError } = require('../core/error.response')

class GalleryController {
    // Get all gallery images (public)
    async getAllImages(req, res) {
        const {
            page = 1,
            limit = 12,
            category,
            search,
            sortBy = 'createdAt',
            order = 'desc',
        } = req.query

        const query = { isPublic: true }

        if (category) {
            query.category = category
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } },
            ]
        }

        const skip = (parseInt(page) - 1) * parseInt(limit)
        const sortOrder = order === 'asc' ? 1 : -1

        const [images, total] = await Promise.all([
            GalleryModel.find(query)
                .populate('uploadedBy', 'fullName avatar')
                .populate('comments.user', 'fullName avatar')
                .sort({ [sortBy]: sortOrder })
                .skip(skip)
                .limit(parseInt(limit))
                .lean(),
            GalleryModel.countDocuments(query),
        ])

        return new SuccessResponse({
            message: 'Get gallery images successfully',
            metadata: {
                images,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    totalPages: Math.ceil(total / parseInt(limit)),
                },
            },
        }).send(res)
    }

    // Get single image
    async getImageById(req, res) {
        const { id } = req.params

        const image = await GalleryModel.findById(id)
            .populate('uploadedBy', 'fullName avatar role')
            .populate('comments.user', 'fullName avatar')
            .populate('likes', 'fullName avatar')
            .lean()

        if (!image) {
            throw new NotFoundError('Image not found')
        }

        return new SuccessResponse({
            message: 'Get image successfully',
            metadata: { image },
        }).send(res)
    }

    // Upload new image (authenticated)
    async uploadImage(req, res) {
        const userId = req.user._id
        const { title, description, category, tags, eventDate, isPublic } = req.body

        if (!req.file) {
            throw new BadRequestError('Please upload an image')
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'dntu-buddies/gallery',
            transformation: [
                { width: 1200, height: 1200, crop: 'limit' },
                { quality: 'auto' },
                { fetch_format: 'auto' },
            ],
        })

        const newImage = await GalleryModel.create({
            title,
            description,
            imageUrl: result.secure_url,
            cloudinaryId: result.public_id,
            category: category || 'other',
            tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [],
            uploadedBy: userId,
            eventDate: eventDate || null,
            isPublic: isPublic !== undefined ? isPublic : true,
        })

        const populatedImage = await GalleryModel.findById(newImage._id)
            .populate('uploadedBy', 'fullName avatar')

        return new SuccessResponse({
            message: 'Image uploaded successfully',
            metadata: { image: populatedImage },
            statusCode: 201,
        }).send(res)
    }

    // Update image (only uploader or admin)
    async updateImage(req, res) {
        const { id } = req.params
        const userId = req.user._id
        const { title, description, category, tags, eventDate, isPublic } = req.body

        const image = await GalleryModel.findById(id)

        if (!image) {
            throw new NotFoundError('Image not found')
        }

        // Check permission
        if (image.uploadedBy.toString() !== userId.toString() && req.user.role !== 'admin') {
            throw new ForbiddenError('You do not have permission to update this image')
        }

        // Update fields
        if (title) image.title = title
        if (description !== undefined) image.description = description
        if (category) image.category = category
        if (tags) image.tags = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())
        if (eventDate !== undefined) image.eventDate = eventDate
        if (isPublic !== undefined) image.isPublic = isPublic

        await image.save()

        const updatedImage = await GalleryModel.findById(id)
            .populate('uploadedBy', 'fullName avatar')

        return new SuccessResponse({
            message: 'Image updated successfully',
            metadata: { image: updatedImage },
        }).send(res)
    }

    // Delete image (only uploader or admin)
    async deleteImage(req, res) {
        const { id } = req.params
        const userId = req.user._id

        const image = await GalleryModel.findById(id)

        if (!image) {
            throw new NotFoundError('Image not found')
        }

        // Check permission
        if (image.uploadedBy.toString() !== userId.toString() && req.user.role !== 'admin') {
            throw new ForbiddenError('You do not have permission to delete this image')
        }

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(image.cloudinaryId)

        // Delete from database
        await GalleryModel.findByIdAndDelete(id)

        return new SuccessResponse({
            message: 'Image deleted successfully',
        }).send(res)
    }

    // Like/Unlike image
    async toggleLike(req, res) {
        const { id } = req.params
        const userId = req.user._id

        const image = await GalleryModel.findById(id)

        if (!image) {
            throw new NotFoundError('Image not found')
        }

        const likeIndex = image.likes.findIndex(
            like => like.toString() === userId.toString()
        )

        if (likeIndex > -1) {
            // Unlike
            image.likes.splice(likeIndex, 1)
        } else {
            // Like
            image.likes.push(userId)
        }

        await image.save()

        return new SuccessResponse({
            message: likeIndex > -1 ? 'Image unliked' : 'Image liked',
            metadata: {
                likes: image.likes.length,
                isLiked: likeIndex === -1,
            },
        }).send(res)
    }

    // Add comment
    async addComment(req, res) {
        const { id } = req.params
        const userId = req.user._id
        const { text } = req.body

        if (!text || text.trim() === '') {
            throw new BadRequestError('Comment text is required')
        }

        const image = await GalleryModel.findById(id)

        if (!image) {
            throw new NotFoundError('Image not found')
        }

        image.comments.push({
            user: userId,
            text: text.trim(),
        })

        await image.save()

        const updatedImage = await GalleryModel.findById(id)
            .populate('comments.user', 'fullName avatar')

        return new SuccessResponse({
            message: 'Comment added successfully',
            metadata: {
                comments: updatedImage.comments,
            },
        }).send(res)
    }

    // Delete comment
    async deleteComment(req, res) {
        const { id, commentId } = req.params
        const userId = req.user._id

        const image = await GalleryModel.findById(id)

        if (!image) {
            throw new NotFoundError('Image not found')
        }

        const comment = image.comments.id(commentId)

        if (!comment) {
            throw new NotFoundError('Comment not found')
        }

        // Check permission
        if (comment.user.toString() !== userId.toString() && req.user.role !== 'admin') {
            throw new ForbiddenError('You do not have permission to delete this comment')
        }

        comment.deleteOne()
        await image.save()

        return new SuccessResponse({
            message: 'Comment deleted successfully',
        }).send(res)
    }

    // Get gallery stats
    async getStats(req, res) {
        const [totalImages, categories, recentUploads] = await Promise.all([
            GalleryModel.countDocuments({ isPublic: true }),
            GalleryModel.aggregate([
                { $match: { isPublic: true } },
                { $group: { _id: '$category', count: { $sum: 1 } } },
            ]),
            GalleryModel.find({ isPublic: true })
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('uploadedBy', 'fullName avatar')
                .lean(),
        ])

        return new SuccessResponse({
            message: 'Get gallery stats successfully',
            metadata: {
                totalImages,
                categories,
                recentUploads,
            },
        }).send(res)
    }
}

module.exports = new GalleryController()
