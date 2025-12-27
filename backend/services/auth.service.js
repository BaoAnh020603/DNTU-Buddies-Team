const bcrypt = require('bcrypt')
const { AdminModel, MemberModel } = require('../models/user.model')
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken')
const { BadRequestError, UnauthorizedError } = require('../core/error')

const generateToken = (user, message, userType = 'admin') => {
    const accessToken = generateAccessToken(user._id, user.role || userType)
    const refreshToken = generateRefreshToken(user._id)
    
    const userResponse = user.toObject()
    delete userResponse.password

    return {
        [userType]: userResponse,
        message,
        accessToken,
        refreshToken,
    }
}

class AuthService {
    // Đăng nhập admin
    async loginUser(req) {
        const { username, password, type = 'admin' } = req.body

        if (!username || !password) {
            throw new BadRequestError('Username và password là bắt buộc')
        }

        // Check if login as admin or member
        if (type === 'member') {
            // Member login with email
            const member = await MemberModel.findOne({ email: username })
            
            if (!member) {
                throw new UnauthorizedError('Email hoặc password không đúng')
            }

            const isPasswordValid = await bcrypt.compare(password, member.password)
            if (!isPasswordValid) {
                throw new UnauthorizedError('Email hoặc password không đúng')
            }

            return generateToken(member, 'Đăng nhập thành công', 'member')
        } else {
            // Admin login
            const admin = await AdminModel.findOne({ username })
            
            if (!admin) {
                throw new UnauthorizedError('Username hoặc password không đúng')
            }

            const isPasswordValid = await bcrypt.compare(password, admin.password)
            if (!isPasswordValid) {
                throw new UnauthorizedError('Username hoặc password không đúng')
            }

            return generateToken(admin, 'Đăng nhập thành công', 'admin')
        }
    }

    // Đăng ký member mới
    async registerMember(req) {
        const { email, password, fullName, studentId } = req.body

        const existingMember = await MemberModel.findOne({ email })
        if (existingMember) {
            throw new BadRequestError('Email đã tồn tại')
        }

        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        const newMember = new MemberModel({
            email,
            password: hashedPassword,
            fullName,
            studentId,
            role: 'Member',
        })

        const savedMember = await newMember.save()
        return generateToken(savedMember, 'Đăng ký thành công', 'member')
    }

    // Đăng ký admin mới (chỉ superadmin mới được tạo)
    async registerAdmin(req) {
        const { username, email, password, fullName } = req.body

        const existingAdmin = await AdminModel.findOne({
            $or: [{ username }, { email }],
        })

        if (existingAdmin) {
            throw new BadRequestError('Username hoặc email đã tồn tại')
        }

        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        const newAdmin = new AdminModel({
            username,
            email,
            password: hashedPassword,
            fullName,
            role: 'admin',
        })

        const savedAdmin = await newAdmin.save()
        return generateToken(savedAdmin, 'Đăng ký admin thành công', 'admin')
    }
}

module.exports = new AuthService()
