const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../.env') })

const { MemberModel } = require('../models/user.model')

const createMember = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('✅ Connected to MongoDB')

        // Thông tin thành viên mới
        const memberData = {
            fullName: 'Nguyễn Nhật Bảo Anh',
            englishName: 'Bao Anh Nguyen',
            email: 'nguyennhatbaoanh@dntubuddiesteam.com',
            password: 'baoanh123', // Mật khẩu mặc định
            studentId: '102210100',
            class: '22T_DT1',
            nationality: 'Việt Nam',
            dateOfBirth: '2004-01-15',
            role: 'Member',
            major: 'Công nghệ thông tin', // Ngành học
            year: 'Năm 3', // Năm học
            avatar: '',
            bio: '',
            description: '',
            skills: [],
            interests: [],
            socialLinks: {
                facebook: '',
                instagram: '',
                linkedin: '',
            },
            achievements: [],
            isActive: true,
            displayOrder: 0,
        }

        // Check if member already exists
        const existingMember = await MemberModel.findOne({ email: memberData.email })
        if (existingMember) {
            console.log('📧 Email:', memberData.email)
            console.log('🔑 Password:', memberData.password)
            process.exit(0)
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(memberData.password, 10)
        memberData.password = hashedPassword

        // Create member
        const newMember = await MemberModel.create(memberData)
        
        console.log('\n🎉 Tạo tài khoản thành công!')
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log('👤 Tên: Nguyễn Nhật Bảo Anh')
        console.log('📧 Email: nguyennhatbaoanh@dntubuddiesteam.com')
        console.log('🔑 Password: baoanh123')
        console.log('🎓 MSSV: 102210100')
        console.log('🏫 Lớp: 22T_DT1')
        console.log('🌍 Quốc tịch: Việt Nam')
        console.log('📅 Ngày sinh: 15/01/2004')
        console.log('📚 Ngành: Công nghệ thông tin')
        console.log('📅 Năm học: Năm 3')
        console.log('💼 Vai trò: Member')
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log('\n📝 Hướng dẫn đăng nhập:')
        console.log('1. Truy cập: http://localhost:5173/auth')
        console.log('2. Nhập email: nguyennhatbaoanh@dntubuddiesteam.com')
        console.log('3. Nhập password: baoanh123')
        console.log('4. Sau khi đăng nhập, vào /profile để cập nhật thông tin')
        console.log('\n✨ Chúc bạn có trải nghiệm tuyệt vời với DNTU Buddies Team!')

        process.exit(0)
    } catch (error) {
        console.error('❌ Error creating member:', error)
        process.exit(1)
    }
}

createMember()
