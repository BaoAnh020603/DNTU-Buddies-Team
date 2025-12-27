const { MemberModel } = require('../models/user.model')
const { BadRequestError, NotFoundError } = require('../core/error')
const cloudinary = require('../utils/cloudinary')
const bcrypt = require('bcrypt')

class MemberService {
    // Lấy tất cả thành viên với filter và pagination
    async getAllMembers(query) {
        const {
            page = 1,
            limit = 20,
            search = '',
            role = '',
            isActive = '',
            sortBy = 'displayOrder',
            order = 'asc',
        } = query

        const filter = {}

        if (search) {
            filter.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { studentId: { $regex: search, $options: 'i' } },
                { role: { $regex: search, $options: 'i' } },
            ]
        }

        if (role) {
            filter.role = { $regex: role, $options: 'i' }
        }

        if (isActive !== '') {
            filter.isActive = isActive === 'true'
        }

        const skip = (parseInt(page) - 1) * parseInt(limit)
        const sortOrder = order === 'desc' ? -1 : 1

        const [members, total] = await Promise.all([
            MemberModel.find(filter)
                .select('-password')
                .sort({ [sortBy]: sortOrder })
                .skip(skip)
                .limit(parseInt(limit))
                .lean(),
            MemberModel.countDocuments(filter),
        ])

        return {
            members,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / parseInt(limit)),
            },
        }
    }

    // Lấy thông tin thành viên theo ID
    async getMemberById(id) {
        const member = await MemberModel.findById(id).select('-password').lean()

        if (!member) {
            throw new NotFoundError('Không tìm thấy thành viên')
        }

        return member
    }

    // Tạo thành viên mới
    async createMember(req) {
        const memberData = req.body

        // Check if email already exists
        if (memberData.email) {
            const existingMember = await MemberModel.findOne({ email: memberData.email })
            if (existingMember) {
                throw new BadRequestError('Email đã tồn tại')
            }
        }

        // Hash password if provided
        if (memberData.password) {
            const saltRounds = 10
            memberData.password = await bcrypt.hash(memberData.password, saltRounds)
        }

        // Upload avatar nếu có
        if (req.file) {
            const result = await cloudinary.uploadImage(req.file.buffer, 'dntu-buddies/members')
            memberData.avatar = result.secure_url
        }

        const member = await MemberModel.create(memberData)
        
        // Remove password from response
        const memberResponse = member.toObject()
        delete memberResponse.password
        
        return memberResponse
    }

    // Cập nhật thông tin thành viên
    async updateMember(id, req) {
        const member = await MemberModel.findById(id)

        if (!member) {
            throw new NotFoundError('Không tìm thấy thành viên')
        }

        const updateData = req.body

        // Check if email is being changed and if it already exists
        if (updateData.email && updateData.email !== member.email) {
            const existingMember = await MemberModel.findOne({ email: updateData.email })
            if (existingMember) {
                throw new BadRequestError('Email đã tồn tại')
            }
        }

        // Hash new password if provided
        if (updateData.password) {
            const saltRounds = 10
            updateData.password = await bcrypt.hash(updateData.password, saltRounds)
        }

        // Upload avatar mới nếu có
        if (req.file) {
            const result = await cloudinary.uploadImage(req.file.buffer, 'dntu-buddies/members')
            updateData.avatar = result.secure_url
        }

        Object.assign(member, updateData)
        await member.save()

        // Remove password from response
        const memberResponse = member.toObject()
        delete memberResponse.password

        return memberResponse
    }

    // Xóa thành viên
    async deleteMember(id) {
        const member = await MemberModel.findById(id)

        if (!member) {
            throw new NotFoundError('Không tìm thấy thành viên')
        }

        await MemberModel.findByIdAndDelete(id)
        return true
    }

    // Thống kê thành viên
    async getMemberStats() {
        const [total, active, inactive, roleStats] = await Promise.all([
            MemberModel.countDocuments(),
            MemberModel.countDocuments({ isActive: true }),
            MemberModel.countDocuments({ isActive: false }),
            MemberModel.aggregate([
                {
                    $group: {
                        _id: '$role',
                        count: { $sum: 1 },
                    },
                },
            ]),
        ])

        return {
            total,
            active,
            inactive,
            byRole: roleStats,
        }
    }
}

module.exports = new MemberService()
