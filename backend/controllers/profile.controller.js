const SuccessResponse = require('../core/success')
const catchAsync = require('../middlewares/catchAsync')
const profileService = require('../services/profile.service')

class ProfileController {
    // [GET] /api/profile/me - Lấy thông tin profile của user hiện tại
    getMyProfile = catchAsync(async (req, res, next) => {
        const result = await profileService.getMyProfile(req.member.id)
        return SuccessResponse.ok(res, 'Lấy thông tin profile thành công', result)
    })

    // [PUT] /api/profile/me - Cập nhật thông tin profile
    updateMyProfile = catchAsync(async (req, res, next) => {
        const result = await profileService.updateMyProfile(req.member.id, req)
        return SuccessResponse.ok(res, 'Cập nhật profile thành công', result)
    })
}

module.exports = new ProfileController()
