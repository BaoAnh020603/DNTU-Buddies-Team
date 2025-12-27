const express = require('express')
const { loginUser, registerMember, registerAdmin } = require('../controllers/auth.controller.js')
const { verifyToken, isSuperAdmin } = require('../middlewares/auth.middleware.js')

const router = express.Router()

router.post('/login', loginUser)
router.post('/register-member', registerMember) // Member registration
router.post('/register-admin', verifyToken, isSuperAdmin, registerAdmin) // Admin registration

module.exports = router
