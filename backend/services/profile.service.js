const { MemberModel } = require('../models/user.model')
const { NotFoundError } = require('../core/error')
const { uploadToCloudinary } = require('../utils/cloudinary')

class ProfileService {
    // Lấy thông tin profile của member
    async getMyProfile(memberId) {
        const member = await MemberModel.findById(memberId).select('-password').lean()

        if (!member) {
            throw new NotFoundError('Không tìm thấy thông tin member')
        }

        return member
    }

    // Cập nhật thông tin profile
    async updateMyProfile(memberId, req) {
        const member = await MemberModel.findById(memberId)

        if (!member) {
            throw new NotFoundError('Không tìm thấy thông tin member')
        }

        const updateData = req.body

        // Parse JSON strings from FormData
        if (typeof updateData.socialLinks === 'string') {
            try {
                updateData.socialLinks = JSON.parse(updateData.socialLinks)
            } catch (e) {
                console.error('Error parsing socialLinks:', e)
            }
        }

        if (typeof updateData.achievements === 'string') {
            try {
                updateData.achievements = JSON.parse(updateData.achievements)
            } catch (e) {
                console.error('Error parsing achievements:', e)
            }
        }

        if (typeof updateData.skills === 'string') {
            try {
                updateData.skills = JSON.parse(updateData.skills)
            } catch (e) {
                console.error('Error parsing skills:', e)
            }
        }

        if (typeof updateData.interests === 'string') {
            try {
                updateData.interests = JSON.parse(updateData.interests)
            } catch (e) {
                console.error('Error parsing interests:', e)
            }
        }

        // Upload avatar mới nếu có
        if (req.file) {
            const timestamp = Date.now()
            const publicId = `member-${memberId}-${timestamp}`
            const imageUrl = await uploadToCloudinary(req.file.buffer, publicId, 'dntu-buddies/members')
            updateData.avatar = imageUrl
        }

        // Không cho phép update email và password qua route này
        delete updateData.email
        delete updateData.password

        Object.assign(member, updateData)
        await member.save()

        const memberResponse = member.toObject()
        delete memberResponse.password

        return memberResponse
    }
}

module.exports = new ProfileService()
