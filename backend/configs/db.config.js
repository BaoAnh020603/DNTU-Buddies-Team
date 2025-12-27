const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {})
        console.info(`MongoDB connected`)
    } catch (error) {
        console.error('Mongoose connect error', error)
        process.exit(1)
    }
}

module.exports = connectDB
