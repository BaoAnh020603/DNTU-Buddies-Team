import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Github, Linkedin, Facebook, Instagram, Globe, Users, Sparkles, LogOut, UserCog, Star, Zap, Rocket, Heart, Trophy, Image as ImageIcon } from 'lucide-react'
import { memberService } from '../../../services/memberService'
import type { Member } from '../../../types/member'
import { useNavigate } from 'react-router-dom'
import { TokenStorage } from '@/contexts/AuthContext'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function HomePage() {
    const [members, setMembers] = useState<Member[]>([])
    const [loading, setLoading] = useState(true)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        fetchMembers()
        checkAuth()
        
        // Initialize AOS
        AOS.init({
            duration: 1000,
            once: false,
            mirror: true,
        })

        // GSAP animations
        gsap.from('.member-card', {
            opacity: 0,
            y: 50,
            scale: 0.9,
            duration: 0.8,
            stagger: 0.1,
            scrollTrigger: {
                trigger: '.members-grid',
                start: 'top 80%',
            }
        })

        return () => {
            AOS.refresh()
        }
    }, [])
    
    const checkAuth = () => {
        const token = TokenStorage.getCookieToken()
        setIsLoggedIn(!!token)
    }
    
    const handleLogout = () => {
        TokenStorage.clearAll()
        setIsLoggedIn(false)
        navigate('/auth')
    }

    const fetchMembers = async () => {
        try {
            setLoading(true)
            const response = await memberService.getAllMembers({
                isActive: true,
                sortBy: 'displayOrder',
                order: 'asc',
                limit: 100,
            })
            // Chỉ hiển thị members đã cập nhật đầy đủ thông tin (có avatar và role)
            const completedMembers = response.members.filter(member => 
                member.avatar && member.avatar.trim() !== '' && 
                member.role && member.role.trim() !== ''
            )
            setMembers(completedMembers)
        } catch (error) {
            console.error('Error fetching members:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
            {/* MEGA Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Floating Particles */}
                {[...Array(40)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            y: [0, -50, 0],
                            x: [0, Math.random() * 80 - 40, 0],
                            opacity: [0.1, 0.5, 0.1],
                            scale: [1, 2, 1],
                            rotate: [0, 360, 0]
                        }}
                        transition={{
                            duration: 6 + Math.random() * 6,
                            repeat: Infinity,
                            delay: Math.random() * 4,
                            ease: "easeInOut"
                        }}
                        className="absolute rounded-full blur-sm"
                        style={{
                            width: `${4 + Math.random() * 6}px`,
                            height: `${4 + Math.random() * 6}px`,
                            background: `linear-gradient(135deg, ${['#0072CE', '#00A0DC', '#003F87'][Math.floor(Math.random() * 3)]}, transparent)`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                    />
                ))}

                {/* Rotating Orbs */}
                <motion.div 
                    animate={{ 
                        y: [0, -60, 0], 
                        x: [0, 50, 0], 
                        rotate: [0, 360],
                        scale: [1, 1.2, 1]
                    }} 
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute top-20 left-20 w-[400px] h-[400px] bg-gradient-to-br from-[#0072CE]/15 to-[#00A0DC]/15 rounded-full blur-3xl" 
                />
                <motion.div 
                    animate={{ 
                        y: [0, 70, 0], 
                        x: [0, -60, 0], 
                        rotate: [360, 0],
                        scale: [1, 1.3, 1]
                    }} 
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-gradient-to-br from-[#003F87]/15 to-[#0072CE]/15 rounded-full blur-3xl" 
                />

                {/* Stars & Icons */}
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={`icon-${i}`}
                        animate={{
                            rotate: [0, 360],
                            scale: [1, 2, 1],
                            opacity: [0.2, 0.7, 0.2]
                        }}
                        transition={{
                            duration: 5 + Math.random() * 4,
                            repeat: Infinity,
                            delay: Math.random() * 3
                        }}
                        className="absolute"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                    >
                        {i % 4 === 0 ? (
                            <Star className="text-[#0072CE]/30" size={12 + Math.random() * 12} fill="currentColor" />
                        ) : i % 4 === 1 ? (
                            <Sparkles className="text-[#00A0DC]/30" size={12 + Math.random() * 12} />
                        ) : i % 4 === 2 ? (
                            <Zap className="text-[#003F87]/30" size={12 + Math.random() * 12} fill="currentColor" />
                        ) : (
                            <Rocket className="text-[#0072CE]/30" size={12 + Math.random() * 12} />
                        )}
                    </motion.div>
                ))}

                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0072CE08_1px,transparent_1px),linear-gradient(to_bottom,#0072CE08_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            </div>

            {/* Header */}
            <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-12"
                    data-aos="fade-down"
                >
                    <div className="flex items-center gap-4">
                        <motion.div 
                            className="w-16 h-16 bg-gradient-to-br from-[#0072CE] to-[#00A0DC] rounded-2xl flex items-center justify-center relative" 
                            style={{ boxShadow: '0 15px 40px rgba(0, 114, 206, 0.5)' }} 
                            whileHover={{ scale: 1.1, rotate: 360 }} 
                            transition={{ duration: 0.6 }}
                            animate={{
                                boxShadow: [
                                    '0 15px 40px rgba(0, 114, 206, 0.5)',
                                    '0 20px 50px rgba(0, 160, 220, 0.6)',
                                    '0 15px 40px rgba(0, 114, 206, 0.5)',
                                ]
                            }}
                        >
                            <Globe className="text-white" size={32} />
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 rounded-2xl border-2 border-white/30"
                            />
                        </motion.div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Chào mừng đến với</p>
                            <p className="text-2xl font-black bg-gradient-to-r from-[#003F87] via-[#0072CE] to-[#00A0DC] bg-clip-text text-transparent">
                                DNTU Buddies Team 🌍
                            </p>
                        </div>
                    </div>
                    
                    {isLoggedIn ? (
                        <div className="flex items-center gap-3">
                            <motion.button 
                                onClick={() => navigate('/gallery')} 
                                whileHover={{ scale: 1.05, y: -3 }} 
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl font-bold transition-all duration-300 relative overflow-hidden flex items-center gap-2"
                                style={{ boxShadow: '0 10px 30px rgba(168, 85, 247, 0.4)' }}
                            >
                                <motion.div
                                    animate={{ x: ['-100%', '200%'] }}
                                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                                />
                                <ImageIcon size={20} className="relative z-10" />
                                <span className="relative z-10">Kho ảnh</span>
                            </motion.button>
                            <motion.button 
                                onClick={() => navigate('/profile')} 
                                whileHover={{ scale: 1.05, y: -3 }} 
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-3 bg-gradient-to-r from-[#0072CE] to-[#00A0DC] hover:from-[#005BA8] hover:to-[#0088BB] text-white rounded-2xl font-bold transition-all duration-300 relative overflow-hidden flex items-center gap-2"
                                style={{ boxShadow: '0 10px 30px rgba(0, 114, 206, 0.4)' }}
                            >
                                <motion.div
                                    animate={{ x: ['-100%', '200%'] }}
                                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                                />
                                <UserCog size={20} className="relative z-10" />
                                <span className="relative z-10">Chỉnh sửa hồ sơ</span>
                            </motion.button>
                            <motion.button 
                                onClick={handleLogout} 
                                whileHover={{ scale: 1.05, y: -3 }} 
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-2xl font-bold transition-all duration-300 relative overflow-hidden flex items-center gap-2"
                                style={{ boxShadow: '0 10px 30px rgba(239, 68, 68, 0.4)' }}
                            >
                                <motion.div
                                    animate={{ x: ['-100%', '200%'] }}
                                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, delay: 1 }}
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                                />
                                <LogOut size={20} className="relative z-10" />
                                <span className="relative z-10">Đăng xuất</span>
                            </motion.button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <motion.button 
                                onClick={() => navigate('/gallery')} 
                                whileHover={{ scale: 1.05, y: -3 }} 
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl font-bold transition-all duration-300 relative overflow-hidden flex items-center gap-2"
                                style={{ boxShadow: '0 10px 30px rgba(168, 85, 247, 0.4)' }}
                            >
                                <motion.div
                                    animate={{ x: ['-100%', '200%'] }}
                                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                                />
                                <ImageIcon size={20} className="relative z-10" />
                                <span className="relative z-10">Kho ảnh</span>
                            </motion.button>
                            <motion.button 
                                onClick={() => navigate('/auth')} 
                                whileHover={{ scale: 1.05, y: -3 }} 
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-gradient-to-r from-[#0072CE] to-[#00A0DC] hover:from-[#005BA8] hover:to-[#0088BB] text-white rounded-2xl font-bold text-lg transition-all duration-300 relative overflow-hidden"
                                style={{ boxShadow: '0 10px 30px rgba(0, 114, 206, 0.4)' }}
                            >
                                <motion.div
                                    animate={{ x: ['-100%', '200%'] }}
                                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                                />
                                <span className="relative z-10">Đăng nhập</span>
                            </motion.button>
                        </div>
                    )}
                </motion.div>

                {/* Hero Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.2 }} 
                    className="text-center mb-16"
                    data-aos="fade-up"
                >
                    <motion.div 
                        className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#0072CE]/10 to-[#00A0DC]/10 rounded-full mb-6 border-2 border-[#0072CE]/20"
                        whileHover={{ scale: 1.05 }}
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                            <Sparkles className="text-[#0072CE]" size={24} />
                        </motion.div>
                        <span className="text-[#0072CE] font-bold text-base">Kết nối toàn cầu</span>
                    </motion.div>
                    
                    <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
                        <motion.span 
                            className="bg-gradient-to-r from-[#003F87] via-[#0072CE] to-[#00A0DC] bg-clip-text text-transparent inline-block"
                            animate={{
                                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                            }}
                            transition={{ duration: 5, repeat: Infinity }}
                            style={{ backgroundSize: '200% 200%' }}
                        >
                            💫🌎 Chúng mình là
                        </motion.span>
                        <br/>
                        <motion.span 
                            className="bg-gradient-to-r from-[#00A0DC] via-[#0072CE] to-[#003F87] bg-clip-text text-transparent inline-block"
                            animate={{
                                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                            }}
                            transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
                            style={{ backgroundSize: '200% 200%' }}
                        >
                            Buddies Team của DNTU
                        </motion.span>
                    </h1>
                    
                    <p className="text-2xl text-gray-600 max-w-3xl mx-auto font-medium">
                        Theo dõi tụi mình trong những hoạt động quốc tế nhé!
                    </p>
                </motion.div>

                {/* Stats Cards */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.3 }} 
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
                    data-aos="zoom-in"
                >
                    {[
                        { icon: Users, label: 'Thành viên', color: 'from-[#0072CE] to-[#00A0DC]', shadow: 'rgba(0, 114, 206, 0.4)' },
                        { icon: Globe, label: 'Quốc gia', color: 'from-[#00A0DC] to-[#0072CE]', shadow: 'rgba(0, 160, 220, 0.4)' },
                        { icon: Trophy, label: 'Hoạt động', color: 'from-[#003F87] to-[#0072CE]', shadow: 'rgba(0, 63, 135, 0.4)' },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ scale: 1.05, y: -5 }}
                            className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border-2 border-white/50 relative overflow-hidden"
                            style={{ 
                                boxShadow: `0 20px 50px ${stat.shadow}`,
                                transformStyle: 'preserve-3d'
                            }}
                        >
                            <motion.div
                                animate={{
                                    background: [
                                        'linear-gradient(135deg, rgba(0, 114, 206, 0.05), transparent)',
                                        'linear-gradient(225deg, rgba(0, 160, 220, 0.05), transparent)',
                                        'linear-gradient(315deg, rgba(0, 114, 206, 0.05), transparent)',
                                    ]
                                }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="absolute inset-0"
                            />
                            
                            <div className="flex items-center gap-5 relative z-10">
                                <motion.div 
                                    className={`w-20 h-20 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center`}
                                    style={{ boxShadow: `0 10px 30px ${stat.shadow}` }}
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                >
                                    <stat.icon className="text-white" size={36} />
                                </motion.div>
                                <div>
                                    <motion.div 
                                        className="text-4xl font-black text-[#003F87]"
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        Nhiều lắm
                                    </motion.div>
                                    <div className="text-base text-gray-600 font-bold">{stat.label}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Members Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-white/60 rounded-3xl p-6 animate-pulse">
                                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                                <div className="h-3 bg-gray-200 rounded"></div>
                            </div>
                        ))}
                    </div>
                ) : members.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20"
                    >
                        <motion.div
                            animate={{ 
                                rotate: 360,
                                y: [0, -10, 0]
                            }}
                            transition={{ 
                                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                                y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                            }}
                            className="inline-block mb-6"
                        >
                            <div className="w-32 h-32 bg-gradient-to-br from-[#0072CE] to-[#003F87] rounded-3xl flex items-center justify-center shadow-2xl"
                                style={{ boxShadow: '0 20px 50px rgba(0, 114, 206, 0.4)' }}
                            >
                                <Users className="text-white" size={60} />
                            </div>
                        </motion.div>
                        <h3 className="text-3xl font-black text-[#003F87] mb-4">
                            Chưa có thành viên nào hoàn thiện profile
                        </h3>
                        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                            Các thành viên vui lòng đăng nhập và cập nhật đầy đủ thông tin cá nhân 
                            (ảnh đại diện, vị trí, v.v.) để xuất hiện tại đây nhé! 💙
                        </p>
                        {isLoggedIn && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/profile')}
                                className="px-8 py-4 bg-gradient-to-r from-[#0072CE] to-[#00A0DC] text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all"
                            >
                                Cập nhật profile của tôi
                            </motion.button>
                        )}
                    </motion.div>
                ) : (
                    <div className="members-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {members.map((member, index) => (
                            <motion.div
                                key={member._id}
                                initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                                transition={{ 
                                    delay: index * 0.05,
                                    type: "spring",
                                    stiffness: 200
                                }}
                                whileHover={{ 
                                    y: -10, 
                                    scale: 1.03,
                                    rotateY: 5
                                }}
                                onClick={() => navigate(`/members/${member._id}`)}
                                className="member-card bg-white/80 backdrop-blur-xl rounded-3xl p-6 cursor-pointer group relative overflow-hidden border-2 border-white/50"
                                style={{ 
                                    boxShadow: '0 20px 50px rgba(0, 114, 206, 0.15)',
                                    transformStyle: 'preserve-3d'
                                }}
                                data-aos="zoom-in"
                                data-aos-delay={index * 50}
                            >
                                {/* Animated gradient */}
                                <motion.div
                                    animate={{
                                        background: [
                                            'linear-gradient(135deg, rgba(0, 114, 206, 0.05), transparent)',
                                            'linear-gradient(225deg, rgba(0, 160, 220, 0.05), transparent)',
                                            'linear-gradient(315deg, rgba(0, 114, 206, 0.05), transparent)',
                                        ]
                                    }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className="absolute inset-0"
                                />

                                {/* Shine effect */}
                                <motion.div
                                    animate={{ x: ['-100%', '200%'] }}
                                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                                />
                                
                                {/* Avatar */}
                                <div className="relative w-24 h-24 mx-auto mb-4">
                                    <motion.div 
                                        className="absolute inset-0 bg-gradient-to-br from-[#0072CE] to-[#00A0DC] rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                    <img
                                        src={member.avatar}
                                        alt={member.fullName}
                                        className="relative w-full h-full rounded-full object-cover border-4 border-white group-hover:border-[#0072CE] transition-all duration-300"
                                        style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)' }}
                                    />
                                </div>

                                {/* Info */}
                                <div className="text-center mb-4 relative z-10">
                                    <h3 className="text-lg font-black text-[#003F87] mb-2 group-hover:text-[#0072CE] transition-colors">
                                        {member.fullName}
                                    </h3>
                                    <motion.div 
                                        className="inline-block px-4 py-2 bg-gradient-to-r from-[#0072CE]/10 to-[#00A0DC]/10 rounded-full mb-2 border border-[#0072CE]/20"
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <p className="text-sm font-bold bg-gradient-to-r from-[#0072CE] to-[#00A0DC] bg-clip-text text-transparent">
                                            {member.role}
                                        </p>
                                    </motion.div>
                                    {member.quote && (
                                        <p className="text-xs text-gray-600 italic mb-2 line-clamp-2">"{member.quote}"</p>
                                    )}
                                    <p className="text-xs text-gray-600 line-clamp-2">
                                        {member.bio || 'Chưa có mô tả'}
                                    </p>
                                </div>

                                {/* Social Links */}
                                <div className="flex justify-center gap-2 relative z-10">
                                    {member.socialLinks?.facebook && (
                                        <motion.a 
                                            whileHover={{ scale: 1.15, y: -3 }} 
                                            whileTap={{ scale: 0.95 }}
                                            href={member.socialLinks.facebook}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl transition-all duration-300"
                                            style={{ boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)' }}
                                        >
                                            <Facebook size={18} />
                                        </motion.a>
                                    )}
                                    {member.socialLinks?.instagram && (
                                        <motion.a 
                                            whileHover={{ scale: 1.15, y: -3 }} 
                                            whileTap={{ scale: 0.95 }}
                                            href={member.socialLinks.instagram}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-xl transition-all duration-300"
                                            style={{ boxShadow: '0 6px 20px rgba(236, 72, 153, 0.4)' }}
                                        >
                                            <Instagram size={18} />
                                        </motion.a>
                                    )}
                                    {member.socialLinks?.github && (
                                        <motion.a 
                                            whileHover={{ scale: 1.15, y: -3 }} 
                                            whileTap={{ scale: 0.95 }}
                                            href={member.socialLinks.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900 text-white rounded-xl transition-all duration-300"
                                            style={{ boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)' }}
                                        >
                                            <Github size={18} />
                                        </motion.a>
                                    )}
                                    {member.socialLinks?.linkedin && (
                                        <motion.a 
                                            whileHover={{ scale: 1.15, y: -3 }} 
                                            whileTap={{ scale: 0.95 }}
                                            href={member.socialLinks.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-sky-500 to-sky-600 text-white rounded-xl transition-all duration-300"
                                            style={{ boxShadow: '0 6px 20px rgba(14, 165, 233, 0.4)' }}
                                        >
                                            <Linkedin size={18} />
                                        </motion.a>
                                    )}
                                </div>

                                {/* Corner sparkle */}
                                <motion.div
                                    animate={{
                                        rotate: 360,
                                        scale: [1, 1.5, 1]
                                    }}
                                    transition={{ duration: 5, repeat: Infinity }}
                                    className="absolute bottom-4 right-4"
                                >
                                    <Heart className="text-[#0072CE]/30" size={16} fill="currentColor" />
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
