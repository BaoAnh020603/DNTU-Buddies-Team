export interface User {
    _id: string
    displayName: string
    username: string
    avatar: string
    email: string
    quote: string
    position: string
    desc: string
    aboutMe: string
    classData: ClassData
    socialLinks: SocialLinks
    role: string
    project: Project[]
    achievements: Achievement[]
    createdAt: string
    updatedAt: string
}

interface SocialLinks {
    linkedin: string
    github: string
    facebook: string
}

interface ClassData {
    numberOfClassesTaught: string
    totalStudents: string
    expTeachingYears: string
}
interface Project {
    title: string
    desc: string
    imageUrl: string
    link: string
    _id: string
}

interface Achievement {
    year: string
    event: string
    desc: string
    _id: string
}
