import axiosInstance from '@/services/axiosInstance'
import type { APIResponse } from '@/types/etc'

// Types for auth requests
export interface LoginRequest {
    username: string
    password: string
    type?: 'admin' | 'member'
}

export interface RegisterMemberRequest {
    email: string
    password: string
    fullName: string
    studentId: string
}

export interface RegisterAdminRequest {
    username: string
    email: string
    password: string
    fullName: string
}

// Response types
export interface Admin {
    _id: string
    username: string
    email: string
    fullName?: string
    role: 'admin' | 'superadmin'
    createdAt: string
    updatedAt: string
}

export interface Member {
    _id: string
    fullName: string
    email: string
    studentId?: string
    role: string
    avatar?: string
    bio?: string
    description?: string
    skills?: string[]
    interests?: string[]
    major?: string
    year?: string
    socialLinks?: {
        facebook?: string
        github?: string
        linkedin?: string
        instagram?: string
        email?: string
    }
    createdAt: string
    updatedAt: string
}

export interface AuthResponse {
    admin?: Admin
    member?: Member
    accessToken: string
    refreshToken: string
}

class AuthService {
    // Token management
    getAccessToken(): string | null {
        return localStorage.getItem('accessToken')
    }

    getRefreshToken(): string | null {
        return localStorage.getItem('refreshToken')
    }

    setTokens(accessToken: string, refreshToken: string): void {
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
    }

    clearTokens(): void {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
    }

    isAuthenticated(): boolean {
        return !!this.getAccessToken()
    }

    logout(): void {
        this.clearTokens()
    }

    // Login (admin or member)
    async login(data: LoginRequest): Promise<AuthResponse> {
        const response = await axiosInstance.post<APIResponse<AuthResponse>>('/auth/login', data)
        const authData = response.data.data
        // Save tokens
        this.setTokens(authData.accessToken, authData.refreshToken)
        return authData
    }

    // Register member
    async registerMember(data: RegisterMemberRequest): Promise<AuthResponse> {
        const response = await axiosInstance.post<APIResponse<AuthResponse>>('/auth/register-member', data)
        const authData = response.data.data
        // Save tokens
        this.setTokens(authData.accessToken, authData.refreshToken)
        return authData
    }

    // Register admin (superadmin only)
    async registerAdmin(data: RegisterAdminRequest): Promise<AuthResponse> {
        const response = await axiosInstance.post<APIResponse<AuthResponse>>('/auth/register', data)
        const authData = response.data.data
        // Save tokens
        this.setTokens(authData.accessToken, authData.refreshToken)
        return authData
    }

    // Get current admin profile (requires authentication)
    async getProfile(): Promise<Admin> {
        const response = await axiosInstance.get<APIResponse<Admin>>('/auth/profile')
        return response.data.data
    }
}

export default new AuthService()
