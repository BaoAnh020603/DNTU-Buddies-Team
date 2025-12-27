const jwt = require('jsonwebtoken')
const { AdminModel, MemberModel } = require('../models/user.model')
const { default: mongoose } = require('mongoose')

// Middleware cho member authentication
const verifyMemberToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Token không được cung cấp hoặc không đúng định dạng',
            })
        }

        const token = authHeader.split(' ')[1]

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token không được cung cấp',
            })
        }

        // Xác thực token với ACCESS_TOKEN_SECRET
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        // Tìm member
        const member = await MemberModel.findById(decoded.userId || decoded.id)

        if (!member) {
            return res.status(401).json({
                success: false,
                message: 'Member không tồn tại',
            })
        }

        // Gán thông tin member vào req
        req.member = {
            id: member._id.toString(),
            email: member.email,
            fullName: member.fullName,
        }

        next()
    } catch (error) {
        console.error('Member auth middleware error:', error)

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token đã hết hạn, vui lòng đăng nhập lại',
            })
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token không hợp lệ',
            })
        } else {
            return res.status(500).json({
                success: false,
                message: 'Lỗi xác thực',
            })
        }
    }
}

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Token không được cung cấp hoặc không đúng định dạng',
            })
        }

        const token = authHeader.split(' ')[1]

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token không được cung cấp',
            })
        }

        // Xác thực token với ACCESS_TOKEN_SECRET
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        // Tìm admin và kiểm tra trạng thái
        const admin = await AdminModel.findById(decoded.userId || decoded.id)

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Admin không tồn tại',
            })
        }

        // Gán thông tin admin vào req
        req.admin = {
            id: admin._id.toString(),
            role: admin.role,
            email: admin.email,
            username: admin.username,
        }

        next()
    } catch (error) {
        console.error('Auth middleware error:', error)

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token đã hết hạn, vui lòng đăng nhập lại',
            })
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token không hợp lệ',
            })
        } else {
            return res.status(500).json({
                success: false,
                message: 'Lỗi xác thực',
            })
        }
    }
}

const isAdmin = (req, res, next) => {
    if (req.admin && (req.admin.role === 'admin' || req.admin.role === 'superadmin')) {
        next()
    } else {
        res.status(403).json({
            success: false,
            message: 'Bạn không có quyền truy cập (yêu cầu quyền admin)',
        })
    }
}

const isSuperAdmin = (req, res, next) => {
    if (req.admin && req.admin.role === 'superadmin') {
        next()
    } else {
        res.status(403).json({
            success: false,
            message: 'Bạn không có quyền truy cập (yêu cầu quyền superadmin)',
        })
    }
}

// Validation cho ID params
const checkIdIsValid = (req, res, next) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: 'ID không hợp lệ',
        })
    }

    next()
}

module.exports = {
    verifyToken,
    verifyMemberToken,
    isAdmin,
    isSuperAdmin,
    checkIdIsValid,
}
