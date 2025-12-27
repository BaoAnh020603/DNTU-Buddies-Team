const SuccessResponse = require('../core/success')
const catchAsync = require('../middlewares/catchAsync')
const memberService = require('../services/member.service')

class MemberController {
    // [GET] /api/members - Lấy tất cả thành viên
    getAllMembers = catchAsync(async (req, res, next) => {
        const result = await memberService.getAllMembers(req.query)
        return SuccessResponse.ok(res, 'Lấy danh sách thành viên thành công', result)
    })

    // [GET] /api/members/:id - Lấy thông tin thành viên theo ID
    getMemberById = catchAsync(async (req, res, next) => {
        const result = await memberService.getMemberById(req.params.id)
        return SuccessResponse.ok(res, 'Lấy thông tin thành viên thành công', result)
    })

    // [POST] /api/members - Tạo thành viên mới (Admin only)
    createMember = catchAsync(async (req, res, next) => {
        const result = await memberService.createMember(req)
        return SuccessResponse.created(res, 'Tạo thành viên mới thành công', result)
    })

    // [PUT] /api/members/:id - Cập nhật thông tin thành viên (Admin only)
    updateMember = catchAsync(async (req, res, next) => {
        const result = await memberService.updateMember(req.params.id, req)
        return SuccessResponse.ok(res, 'Cập nhật thông tin thành viên thành công', result)
    })

    // [DELETE] /api/members/:id - Xóa thành viên (Admin only)
    deleteMember = catchAsync(async (req, res, next) => {
        await memberService.deleteMember(req.params.id)
        return SuccessResponse.ok(res, 'Xóa thành viên thành công')
    })

    // [GET] /api/members/stats - Thống kê thành viên
    getMemberStats = catchAsync(async (req, res, next) => {
        const result = await memberService.getMemberStats()
        return SuccessResponse.ok(res, 'Lấy thống kê thành công', result)
    })
}

module.exports = new MemberController()
