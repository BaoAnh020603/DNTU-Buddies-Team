import axiosInstance from './axiosInstance'
import { Member, MemberResponse, MemberStats } from '../types/member'

export const memberService = {
    // Lấy tất cả thành viên
    getAllMembers: async (params?: {
        page?: number
        limit?: number
        search?: string
        role?: string
        isActive?: boolean
        sortBy?: string
        order?: 'asc' | 'desc'
    }): Promise<MemberResponse> => {
        const response = await axiosInstance.get('/members', { params })
        return response.data.data
    },

    // Lấy thông tin thành viên theo ID
    getMemberById: async (id: string): Promise<Member> => {
        const response = await axiosInstance.get(`/members/${id}`)
        return response.data.data
    },

    // Tạo thành viên mới (Admin only)
    createMember: async (formData: FormData): Promise<Member> => {
        const response = await axiosInstance.post('/members', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        return response.data.data
    },

    // Cập nhật thông tin thành viên (Admin only)
    updateMember: async (id: string, formData: FormData): Promise<Member> => {
        const response = await axiosInstance.put(`/members/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        return response.data.data
    },

    // Xóa thành viên (Admin only)
    deleteMember: async (id: string): Promise<void> => {
        await axiosInstance.delete(`/members/${id}`)
    },

    // Lấy thống kê thành viên
    getMemberStats: async (): Promise<MemberStats> => {
        const response = await axiosInstance.get('/members/stats')
        return response.data.data
    },
}
