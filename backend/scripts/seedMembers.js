const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../.env') })

const { MemberModel, AdminModel } = require('../models/user.model')

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('✅ Connected to MongoDB')

        // Clear existing data
        await MemberModel.deleteMany({})
        await AdminModel.deleteMany({})
        console.log('🗑️  Cleared existing data')

        // Create default admin
        const hashedPassword = await bcrypt.hash('admin123', 10)
        await AdminModel.create({
            username: 'admin',
            email: 'admin@dntubuddies.com',
            password: hashedPassword,
            fullName: 'Admin DNTU Buddies',
            role: 'superadmin',
        })
        console.log('✅ Created default admin (username: admin, password: admin123)')

        console.log('\n🎉 Seed completed successfully!')
        console.log('ℹ️  No sample members created. Members will be added through registration.')
        process.exit(0)
    } catch (error) {
        console.error('❌ Error seeding database:', error)
        process.exit(1)
    }
}

seedDatabase()
