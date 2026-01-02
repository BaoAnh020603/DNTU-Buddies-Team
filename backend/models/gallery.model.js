const mongoose = require('mongoose')

const gallerySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            default: '',
        },
        imageUrl: {
            type: String,
            required: true,
        },
        cloudinaryId: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            enum: ['event', 'meeting', 'activity', 'trip', 'other'],
            default: 'other',
        },
        tags: [{
            type: String,
            trim: true,
        }],
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Member',
            required: true,
        },
        likes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Member',
        }],
        comments: [{
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Member',
                required: true,
            },
            text: {
                type: String,
                required: true,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        }],
        eventDate: {
            type: Date,
            default: null,
        },
        isPublic: {
            type: Boolean,
            default: true,
        },
        displayOrder: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
)

// Index for faster queries
gallerySchema.index({ category: 1, createdAt: -1 })
gallerySchema.index({ uploadedBy: 1 })
gallerySchema.index({ isPublic: 1 })

const GalleryModel = mongoose.model('Gallery', gallerySchema)

module.exports = { GalleryModel }
