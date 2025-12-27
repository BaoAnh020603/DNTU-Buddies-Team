const mongoose = require('mongoose')

const MemberSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
            min: 3,
            max: 100,
        },
        englishName: {
            type: String,
            trim: true,
            max: 100,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            max: 100,
        },
        password: {
            type: String,
            required: true,
            min: 6,
            max: 150,
        },
        studentId: {
            type: String,
            trim: true,
            max: 50,
        },
        class: {
            type: String,
            trim: true,
            max: 100,
        },
        nationality: {
            type: String,
            trim: true,
            max: 100,
        },
        dateOfBirth: {
            type: Date,
        },
        role: {
            type: String,
            trim: true,
            max: 100,
            default: '',
        },
        avatar: {
            type: String,
            max: 500,
            trim: true,
            default: '',
        },
        quote: {
            type: String,
            max: 200,
            trim: true,
            default: '',
        },
        bio: {
            type: String,
            max: 500,
            trim: true,
            default: '',
        },
        description: {
            type: String,
            max: 2000,
            trim: true,
            default: '',
        },
        // Thâm niên
        eventsAttended: {
            type: Number,
            default: 0,
        },
        foreignersMet: {
            type: Number,
            default: 0,
        },
        joinYear: {
            type: String,
            trim: true,
            max: 50,
            default: '',
        },
        skills: [{
            type: String,
            trim: true,
            max: 100,
        }],
        interests: [{
            type: String,
            trim: true,
            max: 100,
        }],
        major: {
            type: String,
            trim: true,
            max: 200,
        },
        year: {
            type: String,
            trim: true,
            max: 50,
        },
        socialLinks: {
            facebook: {
                type: String,
                max: 500,
                default: '',
            },
            instagram: {
                type: String,
                max: 500,
                default: '',
            },
            linkedin: {
                type: String,
                max: 500,
                default: '',
            },
            github: {
                type: String,
                max: 500,
                default: '',
            },
            email: {
                type: String,
                max: 200,
                default: '',
            },
        },
        achievements: [{
            title: {
                type: String,
                trim: true,
                max: 200,
            },
            description: {
                type: String,
                trim: true,
                max: 500,
            },
            year: {
                type: String,
                trim: true,
                max: 50,
            },
        }],
        photos: [{
            url: {
                type: String,
                trim: true,
                max: 500,
            },
            caption: {
                type: String,
                trim: true,
                max: 200,
            },
        }],
        projects: [{
            name: {
                type: String,
                trim: true,
                max: 200,
            },
            description: {
                type: String,
                trim: true,
                max: 500,
            },
            link: {
                type: String,
                trim: true,
                max: 500,
            },
            image: {
                type: String,
                trim: true,
                max: 500,
            },
        }],
        joinedDate: {
            type: Date,
            default: Date.now,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        displayOrder: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
)

const AdminSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            min: 3,
            max: 50,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            max: 100,
        },
        password: {
            type: String,
            required: true,
            min: 6,
            max: 150,
        },
        fullName: {
            type: String,
            trim: true,
            max: 100,
        },
        role: {
            type: String,
            enum: ['admin', 'superadmin'],
            default: 'admin',
        },
    },
    { timestamps: true }
)

module.exports = {
    MemberModel: mongoose.model('Member', MemberSchema),
    AdminModel: mongoose.model('Admin', AdminSchema),
}
