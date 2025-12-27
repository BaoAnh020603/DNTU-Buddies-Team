const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const path = require('path')
const readline = require('readline')
require('dotenv').config({ path: path.join(__dirname, '../.env') })

const { MemberModel } = require('../models/user.model')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const question = (query) => new Promise((resolve) => rl.question(query, resolve))

const createMemberInteractive = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('✅ Connected to MongoDB')
        console.log('\n🎯 TẠO TÀI KHOẢN THÀNH VIÊN MỚI')
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

        // Nhập thông tin
        const fullName = await question('👤 Họ và tên: ')
        const englishName = await question('🌐 Tên tiếng Anh: ')
        const email = await question('📧 Email: ')
        const studentId = await question('🎓 MSSV: ')
        const classInput = await question('🏫 Lớp: ')
        const nationality = await question('🌍 Quốc tịch: ')
        const dateOfBirth = await question('📅 Ngày sinh (YYYY-MM-DD): ')
        const major = await question('📚 Ngành học: ')
        const year = await question('📅 Năm học (VD: Năm 3): ')
        
        // Tạo password mặc định từ tên
        const defaultPassword = fullName.toLowerCase().replace(/\s+/g, '') + '123'
        const useDefaultPassword = await question(`🔑 Sử dụng mật khẩu mặc định "${defaultPassword}"? (y/n): `)
        
        let password = defaultPassword
        if (useDefaultPassword.toLowerCase() !== 'y') {
            password = await question('🔑 Nhập mật khẩu tùy chỉnh: ')
        }

        // Check if member already exists
        const existingMember = await MemberModel.findOne({ email })
        if (existingMember) {
            console.log('\n⚠️  Email đã tồn tại trong hệ thống!')
            console.log('📧 Email:', email)
            rl.close()
            process.exit(0)
        }

        // Create member data
        const memberData = {
            fullName,
            englishName,
            email,
            password: await bcrypt.hash(password, 10),
            studentId,
            class: classInput,
            nationality,
            dateOfBirth,
            role: 'Member',
            major,
            year,
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

        // Create member
        await MemberModel.create(memberData)
        
        console.log('\n🎉 TẠO TÀI KHOẢN THÀNH CÔNG!')
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log('👤 Tên:', fullName)
        console.log('🌐 Tên tiếng Anh:', englishName)
        console.log('📧 Email:', email)
        console.log('🔑 Password:', password)
        console.log('🎓 MSSV:', studentId)
        console.log('🏫 Lớp:', classInput)
        console.log('🌍 Quốc tịch:', nationality)
        console.log('📅 Ngày sinh:', dateOfBirth)
        console.log('📚 Ngành:', major)
        console.log('📅 Năm học:', year)
        console.log('💼 Vai trò: Member')
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log('\n📝 GỬI THÔNG TIN NÀY CHO THÀNH VIÊN:')
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log(`Chào ${fullName}!`)
        console.log(`\nTài khoản DNTU Buddies Team của bạn đã được tạo:`)
        console.log(`📧 Email: ${email}`)
        console.log(`🔑 Mật khẩu: ${password}`)
        console.log(`\n🌐 Đăng nhập tại: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth`)
        console.log(`\n⚠️ Vui lòng đổi mật khẩu sau khi đăng nhập lần đầu!`)
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

        rl.close()
        process.exit(0)
    } catch (error) {
        console.error('❌ Error creating member:', error)
        rl.close()
        process.exit(1)
    }
}

createMemberInteractive()
