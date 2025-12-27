const AuthService = require('../services/auth.service')
const SuccessResponse = require('../core/success')
const catchAsync = require('../middlewares/catchAsync')

class AuthController {
    // [POST] /api/auth/login
    loginUser = catchAsync(async (req, res, next) => {
        const result = await AuthService.loginUser(req)

        res.cookie('cookie', result.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000 * 24, // 24 hours
            path: '/',
        })

        const responseData = result.admin 
            ? { admin: result.admin, accessToken: result.accessToken, refreshToken: result.refreshToken }
            : { member: result.member, accessToken: result.accessToken, refreshToken: result.refreshToken }

        return SuccessResponse.ok(res, result.message, responseData)
    })

    // [POST] /api/auth/register-member - Đăng ký member mới
    registerMember = catchAsync(async (req, res, next) => {
        const result = await AuthService.registerMember(req)

        return SuccessResponse.created(res, result.message, {
            member: result.member,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
        })
    })

    // [POST] /api/auth/register-admin - Đăng ký admin mới
    registerAdmin = catchAsync(async (req, res, next) => {
        const result = await AuthService.registerAdmin(req)

        return SuccessResponse.created(res, result.message, {
            admin: result.admin,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
        })
    })
}

module.exports = new AuthController()
