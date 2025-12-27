import axiosInstance from '@/services/axiosInstance'
import type { APIResponse } from '@/types/etc'
import type { Member } from '@/types/member'

export interface UpdateProfileRequest {
    fullName?: string
    studentId?: string
    role?: string
    quote?: string
    bio?: string
    description?: string
    eventsAttended?: number
    foreignersMet?: number
    joinYear?: string
    skills?: string[]
    interests?: string[]
    major?: string
    year?: string
    socialLinks?: {
        facebook?: string
        instagram?: string
        linkedin?: string
        github?: string
        email?: string
    }
    achievements?: Array<{
        title: string
        description: string
        year: string
    }>
}

class ProfileService {
    // Get my profile
    async getMyProfile(): Promise<Member> {
        const response = await axiosInstance.get<APIResponse<Member>>('/profile/me')
        return response.data.data
    }

    // Update my profile
    async updateMyProfile(data: UpdateProfileRequest): Promise<Member> {
        const response = await axiosInstance.put<APIResponse<Member>>('/profile/me', data)
        return response.data.data
    }

    // Update profile with avatar
    async updateProfileWithAvatar(data: UpdateProfileRequest, avatar?: File): Promise<Member> {
        const formData = new FormData()
        
        if (avatar) {
            formData.append('avatar', avatar)
        }
        
        // Append other fields
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                if (typeof value === 'object') {
                    formData.append(key, JSON.stringify(value))
                } else {
                    formData.append(key, value.toString())
                }
            }
        })

        const response = await axiosInstance.put<APIResponse<Member>>('/profile/me', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        return response.data.data
    }
}

export default new ProfileService()
