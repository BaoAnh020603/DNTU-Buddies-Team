const express = require('express')
const router = express.Router()

// ping check server is running
router.use('/ping', (req, res) => {
    res.status(200).json({ message: 'DNTU Buddies API is running!' })
})

// Authentication routes (Admin & Member)
router.use('/auth', require('./auth.router'))

// Profile routes (Member)
router.use('/profile', require('./profile.router'))

// Members routes (Public & Admin)
router.use('/members', require('./member.router'))

// Gallery routes (Public & Authenticated)
router.use('/gallery', require('./gallery.router'))

module.exports = router
