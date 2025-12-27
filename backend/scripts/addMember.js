const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../.env') })

const { MemberModel } = require('../models/user.model')

const addNewMember = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('✅ Connected to MongoDB')

        // Thông tin thành viên mới
        const newMember = {
            fullName: 'Nguyễn Nhật Bảo Anh',
            email: 'nguyennhatbaoanh@dntubuddiesteam.com',
            password: 'baoanh123', // Mật khẩu mặc định
            studentId: '102210100',
            role: 'Member',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
            bio: 'Thành viên DNTU Buddies Team',
            description: 'Tôi là Bảo Anh, rất vui được tham gia vào các hoạt động quốc tế của DNTU Buddies Team.',
            skills: ['Communication', 'English', 'Teamwork'],
            interests: ['International Relations', 'Cultural Exchange', 'Travel'],
            major: 'Chưa cập nhật',
            year: 'Chưa cập nhật',
            socialLinks: {
                facebook: '',
                instagram: '',
                linkedin: '',
                github: '',
                email: 'nguyennhatbaoanh@dntubuddiesteam.com',
            },
            isActive: true,
            displayOrder: 100,
        }

        // Check if email already exists
        const existingMember = await MemberModel.findOne({ email: newMember.email })
        if (existingMember) {
            console.log('⚠️  Email đã tồn tại trong hệ thống')
            console.log('📧 Email:', existingMember.email)
            console.log('👤 Tên:', existingMember.fullName)
            process.exit(0)
        }

        // Hash password
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(newMember.password, saltRounds)
        newMember.password = hashedPassword

        // Create member
        const member = await MemberModel.create(newMember)
        
        console.log('\n🎉 Tạo thành viên mới thành công!')
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log('👤 Họ tên:', member.fullName)
        console.log('📧 Email:', 'nguyennhatbaoanh@dntubuddiesteam.com')
        console.log('🔑 Password:', 'baoanh123')
        console.log('🎓 MSSV:', member.studentId)
        console.log('💼 Vai trò:', member.role)
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log('\n📝 Hướng dẫn đăng nhập:')
        console.log('1. Truy cập: http://localhost:5173/auth')
        console.log('2. Nhập email: nguyennhatbaoanh@dntubuddiesteam.com')
        console.log('3. Nhập password: baoanh123')
        console.log('4. Sau khi đăng nhập, vào /profile để cập nhật thông tin')
        console.log('\n✨ Chúc bạn có trải nghiệm tuyệt vời với DNTU Buddies Team!')
        
        process.exit(0)
    } catch (error) {
        console.error('❌ Error:', error)
        process.exit(1)
    }
}

addNewMember()
