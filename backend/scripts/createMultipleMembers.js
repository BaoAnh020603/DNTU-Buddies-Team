const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../.env') })

const { MemberModel } = require('../models/user.model')

// Helper function to convert Vietnamese name to email-friendly format
const nameToEmail = (fullName) => {
    const name = fullName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .replace(/\s+/g, '')
    return `${name}@dntubuddiesteam.com`
}

// Helper function to create password from name
const nameToPassword = (fullName) => {
    const name = fullName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .replace(/\s+/g, '')
    return `${name}123`
}

const members = [
    'Đinh Thị Hải Anh',
    'Lê Hoàng Yến Nhi',
    'Trần Quang Linh',
    'Cấn Lê Thủy Tiên',
    'Hồ Thị Mỹ Duyên',
    'Nguyễn Lê Thành Danh',
    'Nguyễn Thị Thu Hiền',
    'Keochampa Bounmy',
    'Nguyễn Ngọc Quỳnh Như',
    'Võ Nguyễn Hoài Lam',
    'Trần Thị Trà My',
    'Trần Gia Kỳ',
    'Mai Thị Yến Nhi',
    'Chu Thị Diễm Quỳnh',
    'Nguyễn Ngọc Bảo Hân',
    'Nguyễn Thị Yến Nhi',
    'Nguyễn Thị Lam',
    'Nguyễn Hoàng Khánh Ly',
    'Dương Đặng Diệu Ngọc',
    'Nguyễn Thế Lộc',
    'Nguyễn Thế Tâm Ngọc Khánh',
    'Lê Thị Thanh Ngân',
    'Nguyễn Thị Ngọc Ánh',
    'Vũ Nguyễn Kiều Vi',
    'Nguyễn Thị Uyên Nhi',
    'Vũ Dương Gia Hân',
    'Nguyễn Phúc Lâm',
    'Trần Quỳnh Thảo Chi',
    'Nguyễn Ngọc Hồng Ân',
    'Bùi Tuấn Kiệt',
    'Bùi Gia Huy',
    'Hoàng Tú Khuyên',
    'Nguyễn Ngọc Diễm Nhi',
    'Phạm Anh Thuỳ',
    'Trần Bình Nhật Nam',
    'Phạm Thái Thiên Kim',
]

const createMultipleMembers = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('✅ Connected to MongoDB\n')
        console.log('🎯 TẠO TÀI KHOẢN CHO 36 THÀNH VIÊN')
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

        const results = []
        let successCount = 0
        let skipCount = 0
        let errorCount = 0

        for (let i = 0; i < members.length; i++) {
            const fullName = members[i]
            const email = nameToEmail(fullName)
            const password = nameToPassword(fullName)

            try {
                // Check if member already exists
                const existingMember = await MemberModel.findOne({ email })
                if (existingMember) {
                    console.log(`⚠️  [${i + 1}/${members.length}] ${fullName} - Email đã tồn tại, bỏ qua`)
                    skipCount++
                    results.push({
                        fullName,
                        email,
                        password,
                        status: 'skipped',
                        reason: 'Email already exists'
                    })
                    continue
                }

                // Create member data
                const memberData = {
                    fullName,
                    englishName: '',
                    email,
                    password: await bcrypt.hash(password, 10),
                    studentId: '',
                    class: '',
                    nationality: 'Việt Nam',
                    dateOfBirth: null,
                    role: '',
                    major: '',
                    year: '',
                    avatar: '',
                    quote: '',
                    bio: '',
                    description: '',
                    eventsAttended: 0,
                    foreignersMet: 0,
                    joinYear: '',
                    skills: [],
                    interests: [],
                    socialLinks: {
                        facebook: '',
                        instagram: '',
                        linkedin: '',
                    },
                    achievements: [],
                    isActive: true,
                    displayOrder: i + 1,
                }

                // Create member
                await MemberModel.create(memberData)
                console.log(`✅ [${i + 1}/${members.length}] ${fullName} - Tạo thành công`)
                successCount++
                results.push({
                    fullName,
                    email,
                    password,
                    status: 'success'
                })

            } catch (error) {
                console.log(`❌ [${i + 1}/${members.length}] ${fullName} - Lỗi: ${error.message}`)
                errorCount++
                results.push({
                    fullName,
                    email,
                    password,
                    status: 'error',
                    error: error.message
                })
            }
        }

        // Summary
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log('📊 TỔNG KẾT')
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log(`✅ Tạo thành công: ${successCount}`)
        console.log(`⚠️  Bỏ qua (đã tồn tại): ${skipCount}`)
        console.log(`❌ Lỗi: ${errorCount}`)
        console.log(`📝 Tổng số: ${members.length}`)
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

        // Print credentials for successful accounts
        if (successCount > 0) {
            console.log('🔑 THÔNG TIN ĐĂNG NHẬP CÁC TÀI KHOẢN MỚI')
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
            
            results.filter(r => r.status === 'success').forEach((result, index) => {
                console.log(`${index + 1}. ${result.fullName}`)
                console.log(`   📧 Email: ${result.email}`)
                console.log(`   🔑 Password: ${result.password}`)
                console.log('')
            })

            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
            console.log('📝 HƯỚNG DẪN GỬI CHO THÀNH VIÊN:')
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
            console.log('Chào bạn!')
            console.log('\nTài khoản DNTU Buddies Team của bạn đã được tạo:')
            console.log('📧 Email: [xem danh sách trên]')
            console.log('🔑 Mật khẩu: [xem danh sách trên]')
            console.log(`\n🌐 Đăng nhập tại: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth`)
            console.log('\n⚠️ Vui lòng:')
            console.log('1. Đăng nhập và đổi mật khẩu ngay')
            console.log('2. Cập nhật đầy đủ thông tin cá nhân tại trang Profile')
            console.log('3. Thêm ảnh đại diện, MSSV, lớp, ngành học, năm học, v.v.')
            console.log('\n✨ Chào mừng bạn đến với DNTU Buddies Team!')
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
        }

        process.exit(0)
    } catch (error) {
        console.error('❌ Error:', error)
        process.exit(1)
    }
}

createMultipleMembers()
