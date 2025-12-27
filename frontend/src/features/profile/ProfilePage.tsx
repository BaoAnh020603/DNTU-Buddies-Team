import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Save, Upload, Plus, X, Award, Calendar, Users as UsersIcon, Heart, Globe, Sparkles, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useState, useEffect, useRef } from 'react'
import profileService from '@/services/profileService'
import LoadingIcon from '@/components/ui/loading-icon'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

interface Achievement {
    title: string
    description: string
    year: string
}

export default function ProfilePage() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [loadingProfile, setLoadingProfile] = useState(true)
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [avatarPreview, setAvatarPreview] = useState<string>('')
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [achievements, setAchievements] = useState<Achievement[]>([])
    const [skills, setSkills] = useState<string[]>([])
    const [interests, setInterests] = useState<string[]>([])
    const [newSkill, setNewSkill] = useState('')
    const [newInterest, setNewInterest] = useState('')
    
    // Mouse tracking for 3D effects
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)
    const cardRef = useRef<HTMLDivElement>(null)
    
    const rotateX = useSpring(useTransform(mouseY, [-300, 300], [5, -5]), { stiffness: 300, damping: 30 })
    const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-5, 5]), { stiffness: 300, damping: 30 })
    
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return
        const rect = cardRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        mouseX.set(e.clientX - centerX)
        mouseY.set(e.clientY - centerY)
    }
    
    const handleMouseLeave = () => {
        mouseX.set(0)
        mouseY.set(0)
    }
    
    useEffect(() => {
        loadProfile()
    }, [])

    const loadProfile = async () => {
        try {
            setLoadingProfile(true)
            const data = await profileService.getMyProfile()
            setAvatarPreview(data.avatar || '')
            setAchievements(data.achievements || [])
            setSkills(data.skills || [])
            setInterests(data.interests || [])
            
            formik.setValues({
                fullName: data.fullName || '',
                englishName: data.englishName || '',
                studentId: data.studentId || '',
                class: data.class || '',
                nationality: data.nationality || '',
                dateOfBirth: data.dateOfBirth || '',
                email: data.email || '',
                role: data.role || '',
                quote: data.quote || '',
                bio: data.bio || '',
                eventsAttended: data.eventsAttended || 0,
                foreignersMet: data.foreignersMet || 0,
                joinYear: data.joinYear || '',
                major: data.major || '',
                year: data.year || '',
                facebook: data.socialLinks?.facebook || '',
                instagram: data.socialLinks?.instagram || '',
                linkedin: data.socialLinks?.linkedin || '',
            })
        } catch (error: any) {
            setErrorMessage('Không thể tải thông tin profile')
        } finally {
            setLoadingProfile(false)
        }
    }
    
    const formik = useFormik({
        initialValues: {
            fullName: '',
            englishName: '',
            studentId: '',
            class: '',
            nationality: '',
            dateOfBirth: '',
            email: '',
            role: '',
            quote: '',
            bio: '',
            eventsAttended: 0,
            foreignersMet: 0,
            joinYear: '',
            major: '',
            year: '',
            facebook: '',
            instagram: '',
            linkedin: '',
        },
        validationSchema: Yup.object({
            fullName: Yup.string().required('Vui lòng nhập họ tên'),
            role: Yup.string(),
            quote: Yup.string().max(200, 'Quote không được quá 200 ký tự'),
            bio: Yup.string().max(500, 'Giới thiệu không được quá 500 ký tự'),
        }),
        onSubmit: (values) => {
            handleUpdateProfile(values)
        },
    })

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setAvatarFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const addAchievement = () => {
        setAchievements([...achievements, { title: '', description: '', year: '' }])
    }

    const removeAchievement = (index: number) => {
        setAchievements(achievements.filter((_, i) => i !== index))
    }

    const updateAchievement = (index: number, field: keyof Achievement, value: string) => {
        const updated = [...achievements]
        updated[index][field] = value
        setAchievements(updated)
    }
    
    const addSkill = () => {
        if (newSkill.trim() && !skills.includes(newSkill.trim())) {
            setSkills([...skills, newSkill.trim()])
            setNewSkill('')
        }
    }
    
    const removeSkill = (index: number) => {
        setSkills(skills.filter((_, i) => i !== index))
    }
    
    const addInterest = () => {
        if (newInterest.trim() && !interests.includes(newInterest.trim())) {
            setInterests([...interests, newInterest.trim()])
            setNewInterest('')
        }
    }
    
    const removeInterest = (index: number) => {
        setInterests(interests.filter((_, i) => i !== index))
    }

    const handleUpdateProfile = async (values: any) => {
        try {
            setLoading(true)
            setErrorMessage('')
            setSuccessMessage('')
            
            const updateData = {
                fullName: values.fullName,
                englishName: values.englishName,
                studentId: values.studentId,
                class: values.class,
                nationality: values.nationality,
                dateOfBirth: values.dateOfBirth,
                role: values.role,
                quote: values.quote,
                bio: values.bio,
                eventsAttended: values.eventsAttended,
                foreignersMet: values.foreignersMet,
                joinYear: values.joinYear,
                major: values.major,
                year: values.year,
                socialLinks: {
                    facebook: values.facebook,
                    instagram: values.instagram,
                    linkedin: values.linkedin,
                },
                achievements: achievements.filter(a => a.title && a.description),
                skills: skills,
                interests: interests,
            }

            await profileService.updateProfileWithAvatar(updateData, avatarFile || undefined)
            setSuccessMessage('Cập nhật profile thành công!')
            setTimeout(() => navigate('/'), 2000)
        } catch (error: any) {
            setErrorMessage(error.response?.data?.message || 'Cập nhật profile thất bại')
        } finally {
            setLoading(false)
        }
    }

    if (loadingProfile) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <LoadingIcon />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
            {/* Animated Background - UN Blue Theme */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Floating Particles */}
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            y: [0, -30, 0],
                            x: [0, Math.random() * 50 - 25, 0],
                            opacity: [0.2, 0.5, 0.2],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{
                            duration: 3 + Math.random() * 4,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                            ease: "easeInOut"
                        }}
                        className="absolute w-2 h-2 bg-[#0072CE] rounded-full blur-sm"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                    />
                ))}
                
                <motion.div 
                    animate={{ 
                        y: [0, -40, 0], 
                        x: [0, 30, 0], 
                        rotate: [0, 180, 360],
                        scale: [1, 1.1, 1]
                    }} 
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-[#0072CE]/20 to-[#00A0DC]/20 rounded-full blur-3xl" 
                />
                <motion.div 
                    animate={{ 
                        y: [0, 50, 0], 
                        x: [0, -40, 0], 
                        rotate: [360, 180, 0],
                        scale: [1, 1.2, 1]
                    }} 
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-[#003F87]/20 to-[#0072CE]/20 rounded-full blur-3xl" 
                />
                <motion.div 
                    animate={{ 
                        scale: [1, 1.3, 1], 
                        opacity: [0.3, 0.6, 0.3],
                        rotate: [0, 90, 0]
                    }} 
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-[#0072CE]/10 to-transparent rounded-full blur-3xl" 
                />
                
                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0072CE08_1px,transparent_1px),linear-gradient(to_bottom,#0072CE08_1px,transparent_1px)] bg-[size:32px_32px]"></div>
                
                {/* Floating Stars */}
                {[...Array(10)].map((_, i) => (
                    <motion.div
                        key={`star-${i}`}
                        animate={{
                            rotate: [0, 360],
                            scale: [1, 1.5, 1],
                            opacity: [0.3, 0.8, 0.3]
                        }}
                        transition={{
                            duration: 4 + Math.random() * 3,
                            repeat: Infinity,
                            delay: Math.random() * 2
                        }}
                        className="absolute"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                    >
                        <Star className="text-[#0072CE]/30" size={12 + Math.random() * 8} />
                    </motion.div>
                ))}
            </div>

            {/* Back Button */}
            <motion.div 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                className="absolute left-8 top-8 z-20"
            >
                <Button 
                    variant={'outline'} 
                    onClick={() => navigate('/')} 
                    className="bg-white/90 backdrop-blur-xl border-2 border-[#0072CE]/20 hover:bg-[#0072CE]/10 hover:border-[#0072CE]/40 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#0072CE]/20"
                >
                    <ArrowLeft className="text-[#0072CE]" />
                </Button>
            </motion.div>

            {/* Main Content */}
            <div className="min-h-screen flex items-center justify-center px-4 py-12 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }} 
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-5xl mx-auto"
                    ref={cardRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                >
                    <motion.div
                        style={{
                            rotateX,
                            rotateY,
                            transformStyle: "preserve-3d",
                        }}
                        className="bg-white/80 backdrop-blur-2xl rounded-[2rem] overflow-hidden relative border border-white/50" 
                        whileHover={{ scale: 1.01 }}
                    >
                        {/* Glassmorphism layers */}
                        <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/40 via-white/20 to-transparent pointer-events-none"></div>
                        <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-[#0072CE]/5 via-transparent to-[#003F87]/5 pointer-events-none"></div>
                        
                        {/* Glow effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#0072CE]/20 via-[#00A0DC]/20 to-[#0072CE]/20 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                        
                        {/* Shine effect */}
                        <motion.div
                            animate={{
                                x: ['-100%', '200%'],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                repeatDelay: 5,
                                ease: "easeInOut"
                            }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 pointer-events-none"
                        />
                        
                        <div className="p-8 md:p-12 relative" style={{ transform: 'translateZ(50px)' }}>
                            {/* Header with Globe Icon */}
                            <motion.div 
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center mb-10"
                            >
                                <motion.div
                                    animate={{ 
                                        rotate: 360,
                                        y: [0, -10, 0]
                                    }}
                                    transition={{ 
                                        rotate: { duration: 30, repeat: Infinity, ease: "linear" },
                                        y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                                    }}
                                    className="inline-block mb-4 relative"
                                    whileHover={{ scale: 1.2 }}
                                >
                                    <div className="w-20 h-20 bg-gradient-to-br from-[#0072CE] to-[#003F87] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#0072CE]/40 relative"
                                        style={{ 
                                            transform: 'perspective(1000px) rotateX(10deg)',
                                            boxShadow: '0 20px 50px rgba(0, 114, 206, 0.5), inset 0 -5px 20px rgba(0, 0, 0, 0.2)'
                                        }}
                                    >
                                        <Globe className="text-white" size={40} />
                                        <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent rounded-2xl"></div>
                                        
                                        {/* Sparkles around globe */}
                                        {[...Array(4)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                animate={{
                                                    scale: [0, 1, 0],
                                                    opacity: [0, 1, 0],
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    delay: i * 0.5,
                                                }}
                                                className="absolute"
                                                style={{
                                                    left: `${50 + 40 * Math.cos((i * Math.PI) / 2)}%`,
                                                    top: `${50 + 40 * Math.sin((i * Math.PI) / 2)}%`,
                                                }}
                                            >
                                                <Sparkles className="text-[#00A0DC]" size={16} />
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                                <motion.h1 
                                    className="text-5xl font-black bg-gradient-to-r from-[#003F87] via-[#0072CE] to-[#00A0DC] bg-clip-text text-transparent mb-3"
                                    style={{ 
                                        textShadow: '0 2px 20px rgba(0, 114, 206, 0.2)',
                                        transform: 'translateZ(30px)'
                                    }}
                                    animate={{
                                        backgroundPosition: ['0%', '100%', '0%'],
                                    }}
                                    transition={{
                                        duration: 5,
                                        repeat: Infinity,
                                        ease: "linear"
                                    }}
                                >
                                    Hồ Sơ Cá Nhân
                                </motion.h1>
                                <p className="text-gray-600 text-lg" style={{ transform: 'translateZ(20px)' }}>Hoàn thiện hồ sơ cá nhân</p>
                            </motion.div>

                            <form onSubmit={formik.handleSubmit} className="space-y-8">
                                {/* Avatar Upload */}
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }} 
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.1 }}
                                    whileHover={{ scale: 1.02, y: -5 }}
                                    className="flex flex-col items-center gap-6 p-10 bg-gradient-to-br from-[#0072CE]/5 to-[#003F87]/5 rounded-3xl border-2 border-[#0072CE]/10 relative overflow-hidden"
                                    style={{ 
                                        boxShadow: 'inset 0 2px 20px rgba(0, 114, 206, 0.05), 0 10px 40px rgba(0, 114, 206, 0.1)',
                                        transform: 'translateZ(40px)'
                                    }}
                                >
                                    {/* Animated background gradient */}
                                    <motion.div
                                        animate={{
                                            background: [
                                                'radial-gradient(circle at 0% 0%, rgba(0, 114, 206, 0.1) 0%, transparent 50%)',
                                                'radial-gradient(circle at 100% 100%, rgba(0, 160, 220, 0.1) 0%, transparent 50%)',
                                                'radial-gradient(circle at 0% 0%, rgba(0, 114, 206, 0.1) 0%, transparent 50%)',
                                            ]
                                        }}
                                        transition={{ duration: 5, repeat: Infinity }}
                                        className="absolute inset-0 pointer-events-none"
                                    />
                                    
                                    <div className="relative group">
                                        <motion.div
                                            whileHover={{ scale: 1.05, rotateY: 5 }}
                                            className="w-40 h-40 rounded-3xl overflow-hidden border-4 border-white shadow-2xl relative"
                                            style={{ 
                                                boxShadow: '0 20px 60px rgba(0, 114, 206, 0.4), 0 0 0 1px rgba(0, 114, 206, 0.1), inset 0 -10px 30px rgba(0, 0, 0, 0.1)',
                                                transform: 'perspective(1000px) rotateY(0deg)',
                                                transformStyle: 'preserve-3d'
                                            }}
                                        >
                                            {avatarPreview ? (
                                                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-[#0072CE] to-[#003F87] flex items-center justify-center">
                                                    <UsersIcon className="text-white" size={60} />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        </motion.div>
                                        <label 
                                            htmlFor="avatar" 
                                            className="absolute -bottom-2 -right-2 w-14 h-14 bg-gradient-to-br from-[#0072CE] to-[#003F87] rounded-2xl flex items-center justify-center cursor-pointer shadow-xl hover:scale-110 transition-all duration-300"
                                            style={{ boxShadow: '0 10px 30px rgba(0, 114, 206, 0.5)' }}
                                        >
                                            <Upload className="text-white" size={24} />
                                        </label>
                                        <input type="file" id="avatar" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                                    </div>
                                    <p className="text-sm text-gray-600 font-semibold">Tải ảnh đại diện của bạn</p>
                                </motion.div>

                                {/* Thông tin cơ bản */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }} 
                                    animate={{ opacity: 1, y: 0 }} 
                                    transition={{ delay: 0.2 }} 
                                    className="space-y-6 p-8 bg-gradient-to-br from-white/50 to-[#0072CE]/5 rounded-3xl border border-[#0072CE]/10"
                                    style={{ boxShadow: '0 10px 30px rgba(0, 114, 206, 0.08)' }}
                                >
                                    <div className="flex items-center gap-4 mb-6">
                                        <div 
                                            className="w-12 h-12 bg-gradient-to-br from-[#0072CE] to-[#003F87] rounded-2xl flex items-center justify-center shadow-lg"
                                            style={{ boxShadow: '0 8px 20px rgba(0, 114, 206, 0.4)' }}
                                        >
                                            <UsersIcon className="text-white" size={24} />
                                        </div>
                                        <h2 className="text-3xl font-bold text-[#003F87]">Thông tin cơ bản</h2>
                                    </div>
                                    
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <Label className="text-gray-700 font-bold text-sm">Tên hiển thị *</Label>
                                            <Input 
                                                {...formik.getFieldProps('fullName')} 
                                                className="h-14 bg-white/80 border-2 border-[#0072CE]/20 focus:border-[#0072CE] focus:ring-4 focus:ring-[#0072CE]/10 rounded-2xl font-medium transition-all"
                                                style={{ boxShadow: '0 4px 15px rgba(0, 114, 206, 0.08)' }}
                                            />
                                            {formik.touched.fullName && formik.errors.fullName && (
                                                <div className="text-red-500 text-sm font-medium">{formik.errors.fullName}</div>
                                            )}
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-gray-700 font-bold text-sm">Tên tiếng Anh</Label>
                                            <Input 
                                                {...formik.getFieldProps('englishName')}
                                                placeholder="VD: John Doe"
                                                className="h-14 bg-white/80 border-2 border-[#0072CE]/20 focus:border-[#0072CE] focus:ring-4 focus:ring-[#0072CE]/10 rounded-2xl font-medium transition-all"
                                                style={{ boxShadow: '0 4px 15px rgba(0, 114, 206, 0.08)' }}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <Label className="text-gray-700 font-bold text-sm">Mã số sinh viên</Label>
                                            <Input 
                                                {...formik.getFieldProps('studentId')}
                                                placeholder="VD: 102210100"
                                                className="h-14 bg-white/80 border-2 border-[#0072CE]/20 focus:border-[#0072CE] focus:ring-4 focus:ring-[#0072CE]/10 rounded-2xl font-medium transition-all"
                                                style={{ boxShadow: '0 4px 15px rgba(0, 114, 206, 0.08)' }}
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-gray-700 font-bold text-sm">Lớp</Label>
                                            <Input 
                                                {...formik.getFieldProps('class')}
                                                placeholder="VD: 22T_DT1"
                                                className="h-14 bg-white/80 border-2 border-[#0072CE]/20 focus:border-[#0072CE] focus:ring-4 focus:ring-[#0072CE]/10 rounded-2xl font-medium transition-all"
                                                style={{ boxShadow: '0 4px 15px rgba(0, 114, 206, 0.08)' }}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <Label className="text-gray-700 font-bold text-sm">Quốc tịch</Label>
                                            <Input 
                                                {...formik.getFieldProps('nationality')}
                                                placeholder="VD: Việt Nam"
                                                className="h-14 bg-white/80 border-2 border-[#0072CE]/20 focus:border-[#0072CE] focus:ring-4 focus:ring-[#0072CE]/10 rounded-2xl font-medium transition-all"
                                                style={{ boxShadow: '0 4px 15px rgba(0, 114, 206, 0.08)' }}
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-gray-700 font-bold text-sm">Ngày sinh</Label>
                                            <Input 
                                                {...formik.getFieldProps('dateOfBirth')}
                                                type="date"
                                                className="h-14 bg-white/80 border-2 border-[#0072CE]/20 focus:border-[#0072CE] focus:ring-4 focus:ring-[#0072CE]/10 rounded-2xl font-medium transition-all"
                                                style={{ boxShadow: '0 4px 15px rgba(0, 114, 206, 0.08)' }}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <Label className="text-gray-700 font-bold text-sm">Vị trí</Label>
                                            <Input 
                                                {...formik.getFieldProps('role')} 
                                                placeholder="VD: International Relations" 
                                                className="h-14 bg-white/80 border-2 border-[#0072CE]/20 focus:border-[#0072CE] focus:ring-4 focus:ring-[#0072CE]/10 rounded-2xl font-medium transition-all"
                                                style={{ boxShadow: '0 4px 15px rgba(0, 114, 206, 0.08)' }}
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-gray-700 font-bold text-sm">Email</Label>
                                            <Input 
                                                value={formik.values.email || ''}
                                                readOnly
                                                disabled
                                                className="h-14 bg-gray-100 border-2 border-gray-200 rounded-2xl font-medium text-gray-600 cursor-not-allowed"
                                                style={{ boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)' }}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <Label className="text-gray-700 font-bold text-sm">Quote của bạn</Label>
                                        <Input 
                                            {...formik.getFieldProps('quote')} 
                                            placeholder="Một câu nói truyền cảm hứng..." 
                                            className="h-14 bg-white/80 border-2 border-[#0072CE]/20 focus:border-[#0072CE] focus:ring-4 focus:ring-[#0072CE]/10 rounded-2xl font-medium transition-all"
                                            style={{ boxShadow: '0 4px 15px rgba(0, 114, 206, 0.08)' }}
                                        />
                                        {formik.touched.quote && formik.errors.quote && (
                                            <div className="text-red-500 text-sm font-medium">{formik.errors.quote}</div>
                                        )}
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <Label className="text-gray-700 font-bold text-sm">Giới thiệu bản thân</Label>
                                        <Textarea 
                                            {...formik.getFieldProps('bio')} 
                                            placeholder="Chia sẻ về bản thân, đam mê và mục tiêu của bạn..." 
                                            className="bg-white/80 border-2 border-[#0072CE]/20 focus:border-[#0072CE] focus:ring-4 focus:ring-[#0072CE]/10 rounded-2xl min-h-[120px] font-medium transition-all"
                                            style={{ boxShadow: '0 4px 15px rgba(0, 114, 206, 0.08)' }}
                                        />
                                        {formik.touched.bio && formik.errors.bio && (
                                            <div className="text-red-500 text-sm font-medium">{formik.errors.bio}</div>
                                        )}
                                    </div>
                                    
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <Label className="text-gray-700 font-bold text-sm">Ngành học</Label>
                                            <Input 
                                                {...formik.getFieldProps('major')} 
                                                placeholder="VD: Công nghệ thông tin" 
                                                className="h-14 bg-white/80 border-2 border-[#0072CE]/20 focus:border-[#0072CE] focus:ring-4 focus:ring-[#0072CE]/10 rounded-2xl font-medium transition-all"
                                                style={{ boxShadow: '0 4px 15px rgba(0, 114, 206, 0.08)' }}
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-gray-700 font-bold text-sm">Năm học</Label>
                                            <Input 
                                                {...formik.getFieldProps('year')} 
                                                placeholder="VD: Năm 3" 
                                                className="h-14 bg-white/80 border-2 border-[#0072CE]/20 focus:border-[#0072CE] focus:ring-4 focus:ring-[#0072CE]/10 rounded-2xl font-medium transition-all"
                                                style={{ boxShadow: '0 4px 15px rgba(0, 114, 206, 0.08)' }}
                                            />
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Thâm niên */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }} 
                                    animate={{ opacity: 1, y: 0 }} 
                                    transition={{ delay: 0.3 }} 
                                    className="space-y-6 p-8 bg-gradient-to-br from-white/50 to-[#00A0DC]/5 rounded-3xl border border-[#00A0DC]/10"
                                    style={{ boxShadow: '0 10px 30px rgba(0, 160, 220, 0.08)' }}
                                >
                                    <div className="flex items-center gap-4 mb-6">
                                        <div 
                                            className="w-12 h-12 bg-gradient-to-br from-[#00A0DC] to-[#0072CE] rounded-2xl flex items-center justify-center shadow-lg"
                                            style={{ boxShadow: '0 8px 20px rgba(0, 160, 220, 0.4)' }}
                                        >
                                            <Calendar className="text-white" size={24} />
                                        </div>
                                        <h2 className="text-3xl font-bold text-[#003F87]">Thâm niên</h2>
                                    </div>
                                    
                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div className="space-y-3">
                                            <Label className="text-gray-700 font-bold text-sm">Số sự kiện đã tham gia</Label>
                                            <Input 
                                                type="number" 
                                                {...formik.getFieldProps('eventsAttended')} 
                                                className="h-14 bg-white/80 border-2 border-[#00A0DC]/20 focus:border-[#00A0DC] focus:ring-4 focus:ring-[#00A0DC]/10 rounded-2xl font-medium transition-all"
                                                style={{ boxShadow: '0 4px 15px rgba(0, 160, 220, 0.08)' }}
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-gray-700 font-bold text-sm">Bạn quốc tế</Label>
                                            <Input 
                                                type="number" 
                                                {...formik.getFieldProps('foreignersMet')} 
                                                className="h-14 bg-white/80 border-2 border-[#00A0DC]/20 focus:border-[#00A0DC] focus:ring-4 focus:ring-[#00A0DC]/10 rounded-2xl font-medium transition-all"
                                                style={{ boxShadow: '0 4px 15px rgba(0, 160, 220, 0.08)' }}
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-gray-700 font-bold text-sm">Năm tham gia</Label>
                                            <Input 
                                                {...formik.getFieldProps('joinYear')} 
                                                placeholder="VD: 2024" 
                                                className="h-14 bg-white/80 border-2 border-[#00A0DC]/20 focus:border-[#00A0DC] focus:ring-4 focus:ring-[#00A0DC]/10 rounded-2xl font-medium transition-all"
                                                style={{ boxShadow: '0 4px 15px rgba(0, 160, 220, 0.08)' }}
                                            />
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Thành tựu */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }} 
                                    animate={{ opacity: 1, y: 0 }} 
                                    transition={{ delay: 0.4 }} 
                                    className="space-y-6 p-8 bg-gradient-to-br from-white/50 to-amber-50/30 rounded-3xl border border-amber-200/30"
                                    style={{ boxShadow: '0 10px 30px rgba(245, 158, 11, 0.08)' }}
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div 
                                                className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg"
                                                style={{ boxShadow: '0 8px 20px rgba(245, 158, 11, 0.4)' }}
                                            >
                                                <Award className="text-white" size={24} />
                                            </div>
                                            <h2 className="text-3xl font-bold text-[#003F87]">Thành tựu</h2>
                                        </div>
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <Button 
                                                type="button" 
                                                onClick={addAchievement} 
                                                className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-bold rounded-2xl h-12 px-6 shadow-lg transition-all"
                                                style={{ boxShadow: '0 6px 20px rgba(245, 158, 11, 0.4)' }}
                                            >
                                                <Plus size={20} /> Thêm
                                            </Button>
                                        </motion.div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        {achievements.map((achievement, index) => (
                                            <motion.div 
                                                key={index}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                className="p-6 bg-gradient-to-br from-amber-50/50 to-orange-50/50 rounded-2xl border-2 border-amber-200/40 relative"
                                                style={{ boxShadow: '0 4px 15px rgba(245, 158, 11, 0.1)' }}
                                            >
                                                <motion.button 
                                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    type="button" 
                                                    onClick={() => removeAchievement(index)} 
                                                    className="absolute top-4 right-4 w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl flex items-center justify-center transition-all shadow-lg"
                                                >
                                                    <X size={18} />
                                                </motion.button>
                                                <div className="space-y-4 pr-12">
                                                    <div className="grid md:grid-cols-2 gap-4">
                                                        <Input 
                                                            value={achievement.title} 
                                                            onChange={(e) => updateAchievement(index, 'title', e.target.value)} 
                                                            placeholder="Tên thành tựu" 
                                                            className="bg-white border-2 border-amber-200/50 focus:border-amber-400 rounded-xl h-12 font-medium"
                                                        />
                                                        <Input 
                                                            value={achievement.year} 
                                                            onChange={(e) => updateAchievement(index, 'year', e.target.value)} 
                                                            placeholder="Năm đạt được" 
                                                            className="bg-white border-2 border-amber-200/50 focus:border-amber-400 rounded-xl h-12 font-medium"
                                                        />
                                                    </div>
                                                    <Textarea 
                                                        value={achievement.description} 
                                                        onChange={(e) => updateAchievement(index, 'description', e.target.value)} 
                                                        placeholder="Mô tả chi tiết thành tựu..." 
                                                        className="bg-white border-2 border-amber-200/50 focus:border-amber-400 rounded-xl min-h-[90px] font-medium"
                                                    />
                                                </div>
                                            </motion.div>
                                        ))}
                                        {achievements.length === 0 && (
                                            <div className="text-center py-12 text-gray-500">
                                                <Award className="mx-auto mb-3 text-gray-400" size={48} />
                                                <p className="font-medium">Chưa có thành tựu nào</p>
                                                <p className="text-sm">Nhấn "Thêm" để bắt đầu!</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>

                                {/* Kỹ năng */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }} 
                                    animate={{ opacity: 1, y: 0 }} 
                                    transition={{ delay: 0.45 }} 
                                    className="space-y-6 p-8 bg-gradient-to-br from-white/50 to-blue-50/30 rounded-3xl border border-blue-200/30"
                                    style={{ boxShadow: '0 10px 30px rgba(59, 130, 246, 0.08)' }}
                                >
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg"
                                            style={{ boxShadow: '0 8px 20px rgba(59, 130, 246, 0.4)' }}
                                        >
                                            <Star className="text-white" size={24} />
                                        </div>
                                        <h2 className="text-3xl font-bold text-[#003F87]">Kỹ năng</h2>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="flex gap-3">
                                            <Input 
                                                value={newSkill}
                                                onChange={(e) => setNewSkill(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                                placeholder="VD: Tiếng Anh, Giao tiếp, Tổ chức sự kiện..." 
                                                className="flex-1 h-12 bg-white border-2 border-blue-200/50 focus:border-blue-500 rounded-xl font-medium"
                                            />
                                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                <Button 
                                                    type="button" 
                                                    onClick={addSkill}
                                                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold rounded-xl h-12 px-6 shadow-lg"
                                                    style={{ boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)' }}
                                                >
                                                    <Plus size={20} />
                                                </Button>
                                            </motion.div>
                                        </div>
                                        
                                        <div className="flex flex-wrap gap-3">
                                            {skills.map((skill, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                    whileHover={{ scale: 1.05 }}
                                                    className="px-5 py-2 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-700 rounded-full font-bold border-2 border-blue-300/50 flex items-center gap-2 group"
                                                >
                                                    <span>{skill}</span>
                                                    <motion.button
                                                        whileHover={{ scale: 1.2, rotate: 90 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        type="button"
                                                        onClick={() => removeSkill(index)}
                                                        className="w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                                                    >
                                                        <X size={12} />
                                                    </motion.button>
                                                </motion.div>
                                            ))}
                                            {skills.length === 0 && (
                                                <div className="text-center py-8 text-gray-500 w-full">
                                                    <Star className="mx-auto mb-3 text-gray-400" size={48} />
                                                    <p className="font-medium">Chưa có kỹ năng nào</p>
                                                    <p className="text-sm">Thêm kỹ năng của bạn!</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Sở thích */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }} 
                                    animate={{ opacity: 1, y: 0 }} 
                                    transition={{ delay: 0.48 }} 
                                    className="space-y-6 p-8 bg-gradient-to-br from-white/50 to-pink-50/30 rounded-3xl border border-pink-200/30"
                                    style={{ boxShadow: '0 10px 30px rgba(236, 72, 153, 0.08)' }}
                                >
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg"
                                            style={{ boxShadow: '0 8px 20px rgba(236, 72, 153, 0.4)' }}
                                        >
                                            <Heart className="text-white" size={24} />
                                        </div>
                                        <h2 className="text-3xl font-bold text-[#003F87]">Sở thích</h2>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="flex gap-3">
                                            <Input 
                                                value={newInterest}
                                                onChange={(e) => setNewInterest(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                                                placeholder="VD: Du lịch, Âm nhạc, Nhiếp ảnh..." 
                                                className="flex-1 h-12 bg-white border-2 border-pink-200/50 focus:border-pink-500 rounded-xl font-medium"
                                            />
                                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                <Button 
                                                    type="button" 
                                                    onClick={addInterest}
                                                    className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold rounded-xl h-12 px-6 shadow-lg"
                                                    style={{ boxShadow: '0 6px 20px rgba(236, 72, 153, 0.4)' }}
                                                >
                                                    <Plus size={20} />
                                                </Button>
                                            </motion.div>
                                        </div>
                                        
                                        <div className="flex flex-wrap gap-3">
                                            {interests.map((interest, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                    whileHover={{ scale: 1.05 }}
                                                    className="px-5 py-2 bg-gradient-to-r from-pink-500/20 to-rose-500/20 text-pink-700 rounded-full font-bold border-2 border-pink-300/50 flex items-center gap-2 group"
                                                >
                                                    <span>{interest}</span>
                                                    <motion.button
                                                        whileHover={{ scale: 1.2, rotate: 90 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        type="button"
                                                        onClick={() => removeInterest(index)}
                                                        className="w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                                                    >
                                                        <X size={12} />
                                                    </motion.button>
                                                </motion.div>
                                            ))}
                                            {interests.length === 0 && (
                                                <div className="text-center py-8 text-gray-500 w-full">
                                                    <Heart className="mx-auto mb-3 text-gray-400" size={48} />
                                                    <p className="font-medium">Chưa có sở thích nào</p>
                                                    <p className="text-sm">Thêm sở thích của bạn!</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Mạng xã hội */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }} 
                                    animate={{ opacity: 1, y: 0 }} 
                                    transition={{ delay: 0.5 }} 
                                    className="space-y-6 p-8 bg-gradient-to-br from-white/50 to-purple-50/30 rounded-3xl border border-purple-200/30"
                                    style={{ boxShadow: '0 10px 30px rgba(168, 85, 247, 0.08)' }}
                                >
                                    <div className="flex items-center gap-4 mb-6">
                                        <div 
                                            className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg"
                                            style={{ boxShadow: '0 8px 20px rgba(168, 85, 247, 0.4)' }}
                                        >
                                            <Heart className="text-white" size={24} />
                                        </div>
                                        <h2 className="text-3xl font-bold text-[#003F87]">Mạng xã hội</h2>
                                    </div>
                                    
                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div className="space-y-3">
                                            <Label className="text-gray-700 font-bold text-sm">Facebook</Label>
                                            <Input 
                                                {...formik.getFieldProps('facebook')} 
                                                placeholder="facebook.com/..." 
                                                className="h-14 bg-white/80 border-2 border-blue-200/50 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-2xl font-medium transition-all"
                                                style={{ boxShadow: '0 4px 15px rgba(59, 130, 246, 0.08)' }}
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-gray-700 font-bold text-sm">Instagram</Label>
                                            <Input 
                                                {...formik.getFieldProps('instagram')} 
                                                placeholder="instagram.com/..." 
                                                className="h-14 bg-white/80 border-2 border-pink-200/50 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 rounded-2xl font-medium transition-all"
                                                style={{ boxShadow: '0 4px 15px rgba(236, 72, 153, 0.08)' }}
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-gray-700 font-bold text-sm">LinkedIn</Label>
                                            <Input 
                                                {...formik.getFieldProps('linkedin')} 
                                                placeholder="linkedin.com/in/..." 
                                                className="h-14 bg-white/80 border-2 border-sky-200/50 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 rounded-2xl font-medium transition-all"
                                                style={{ boxShadow: '0 4px 15px rgba(14, 165, 233, 0.08)' }}
                                            />
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Messages */}
                                {errorMessage && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: -10 }} 
                                        animate={{ opacity: 1, y: 0 }} 
                                        className="p-5 bg-red-50 border-2 border-red-200 rounded-2xl text-red-600 font-semibold shadow-lg"
                                    >
                                        {errorMessage}
                                    </motion.div>
                                )}
                                {successMessage && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: -10 }} 
                                        animate={{ opacity: 1, y: 0 }} 
                                        className="p-5 bg-green-50 border-2 border-green-200 rounded-2xl text-green-600 font-semibold shadow-lg"
                                    >
                                        {successMessage}
                                    </motion.div>
                                )}

                                {/* Submit Button */}
                                <motion.div 
                                    whileHover={{ scale: 1.02 }} 
                                    whileTap={{ scale: 0.98 }}
                                    className="pt-4"
                                >
                                    <Button 
                                        type="submit" 
                                        disabled={loading} 
                                        className="w-full h-16 bg-gradient-to-r from-[#003F87] via-[#0072CE] to-[#00A0DC] hover:from-[#002855] hover:via-[#005BA8] hover:to-[#0088BB] text-white font-bold text-lg rounded-2xl relative overflow-hidden group transition-all duration-300"
                                        style={{ boxShadow: '0 15px 40px rgba(0, 114, 206, 0.5)' }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                        {loading && <LoadingIcon />}
                                        {!loading && <Save size={24} />}
                                        <span className="relative z-10 ml-2">Lưu thay đổi</span>
                                    </Button>
                                </motion.div>
                            </form>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}
