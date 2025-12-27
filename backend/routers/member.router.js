const express = require('express')
const router = express.Router()
const memberController = require('../controllers/member.controller')
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware')
const upload = require('../middlewares/upload.middleware')

// Public routes
router.get('/', memberController.getAllMembers)
router.get('/stats', memberController.getMemberStats)
router.get('/:id', memberController.getMemberById)

// Admin routes
router.post('/', verifyToken, isAdmin, upload.single('avatar'), memberController.createMember)
router.put('/:id', verifyToken, isAdmin, upload.single('avatar'), memberController.updateMember)
router.delete('/:id', verifyToken, isAdmin, memberController.deleteMember)

module.exports = router
