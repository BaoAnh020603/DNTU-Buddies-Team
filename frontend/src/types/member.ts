export interface SocialLinks {
    facebook?: string
    instagram?: string
    linkedin?: string
    github?: string
    email?: string
}

export interface Achievement {
    title: string
    description: string
    year: string
    _id?: string
}

export interface Photo {
    url: string
    caption?: string
    _id?: string
}

export interface Project {
    name: string
    description: string
    link?: string
    image?: string
    _id?: string
}

export interface Member {
    _id: string
    fullName: string
    englishName?: string
    email: string
    studentId?: string
    class?: string
    nationality?: string
    dateOfBirth?: string
    role: string
    avatar: string
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
    socialLinks?: SocialLinks
    achievements?: Achievement[]
    photos?: Photo[]
    projects?: Project[]
    joinedDate: string
    isActive: boolean
    displayOrder: number
    createdAt: string
    updatedAt: string
}

export interface MemberStats {
    total: number
    active: number
    inactive: number
    byRole: Array<{
        _id: string
        count: number
    }>
}

export interface MemberResponse {
    members: Member[]
    pagination: {
        total: number
        page: number
        limit: number
        totalPages: number
    }
}
