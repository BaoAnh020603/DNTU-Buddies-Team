const express = require('express')
const router = express.Router()
const { verifyMemberToken } = require('../middlewares/auth.middleware')
const profileController = require('../controllers/profile.controller')
const upload = require('../middlewares/upload.middleware')

// Get current user profile
router.get('/me', verifyMemberToken, profileController.getMyProfile)

// Update current user profile
router.put('/me', verifyMemberToken, upload.single('avatar'), profileController.updateMyProfile)

module.exports = router
