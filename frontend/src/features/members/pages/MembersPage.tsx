import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { memberService } from '../../../services/memberService'
import type { Member } from '../../../types/member'
import { Search, Users, Sparkles, Star, Zap, Rocket, Globe, ArrowRight, Filter, X } from 'lucide-react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function MembersPage() {
    const navigate = useNavigate()
    const [members, setMembers] = useState<Member[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [roleFilter, setRoleFilter] = useState<string>('all')

    useEffect(() => {
        fetchMembers()
        
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

    const fetchMembers = async () => {
        try {
            setLoading(true)
            const data = await memberService.getAllMembers()
            // Fix type: data is MemberResponse, extract members array
            const membersArray = Array.isArray(data) ? data : data.members
            setMembers(membersArray)
        } catch (error) {
            console.error('Error fetching members:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredMembers = members.filter(member => {
        const matchesSearch = member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            member.studentId?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesRole = roleFilter === 'all' || member.role === roleFilter
        return matchesSearch && matchesRole
    })

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center relative overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0">
                    {[...Array(30)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{
                                scale: [1, 2, 1],
                                opacity: [0.3, 0.6, 0.3],
                                rotate: [0, 180, 360]
                            }}
                            transition={{
                                duration: 3 + Math.random() * 2,
                                repeat: Infinity,
                                delay: Math.random() * 2
                            }}
                            className="absolute w-4 h-4 bg-[#0072CE] rounded-full blur-sm"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                        />
                    ))}
                </div>
                
                {/* Loading spinner */}
                <div className="relative">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-20 h-20 border-4 border-[#0072CE] border-t-transparent rounded-full"
                    />
                    <motion.div
                        animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 1, 0.5]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 w-20 h-20 border-4 border-[#00A0DC] border-t-transparent rounded-full blur-sm"
                    />
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
            {/* Mega Animated Background */}
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
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                    data-aos="fade-down"
                >
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <motion.div
                            animate={{ 
                                rotate: 360,
                                scale: [1, 1.2, 1]
                            }}
                            transition={{ duration: 10, repeat: Infinity }}
                            className="w-16 h-16 bg-gradient-to-br from-[#0072CE] to-[#00A0DC] rounded-2xl flex items-center justify-center shadow-2xl"
                            style={{ boxShadow: '0 15px 40px rgba(0, 114, 206, 0.5)' }}
                        >
                            <Globe className="text-white" size={32} />
                        </motion.div>
                    </div>
                    <h1 className="text-6xl font-black bg-gradient-to-r from-[#003F87] via-[#0072CE] to-[#00A0DC] bg-clip-text text-transparent mb-4">
                        Thành Viên
                    </h1>
                    <p className="text-xl text-gray-600 font-medium">DNTU Buddies Team</p>
                </motion.div>

                {/* Search & Filter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8 space-y-4"
                    data-aos="fade-up"
                >
                    {/* Search Bar */}
                    <div className="relative max-w-2xl mx-auto">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="relative"
                        >
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#0072CE]" size={24} />
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tên hoặc MSSV..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-16 pr-12 py-5 bg-white/80 backdrop-blur-xl border-2 border-[#0072CE]/20 rounded-3xl text-lg font-medium focus:outline-none focus:border-[#0072CE] transition-all shadow-lg"
                            />
                            {searchTerm && (
                                <motion.button
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0072CE]"
                                >
                                    <X size={20} />
                                </motion.button>
                            )}
                        </motion.div>
                    </div>

                    {/* Role Filter */}
                    <div className="flex items-center justify-center gap-3 flex-wrap">
                        <Filter className="text-[#0072CE]" size={20} />
                        {['all', 'Admin', 'Member'].map((role) => (
                            <motion.button
                                key={role}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setRoleFilter(role)}
                                className={`px-6 py-3 rounded-2xl font-bold transition-all ${
                                    roleFilter === role
                                        ? 'bg-gradient-to-r from-[#0072CE] to-[#00A0DC] text-white shadow-lg'
                                        : 'bg-white/80 text-gray-700 border-2 border-gray-200 hover:border-[#0072CE]'
                                }`}
                            >
                                {role === 'all' ? 'Tất cả' : role}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Members Count */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-center mb-8"
                >
                    <p className="text-lg text-gray-600 font-medium">
                        Tìm thấy <span className="text-[#0072CE] font-black text-2xl">{filteredMembers.length}</span> thành viên
                    </p>
                </motion.div>

                {/* Members Grid */}
                <div className="members-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredMembers.map((member, index) => (
                        <motion.div
                            key={member._id}
                            initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                            transition={{ 
                                delay: index * 0.1,
                                type: "spring",
                                stiffness: 200
                            }}
                            whileHover={{ 
                                scale: 1.05,
                                rotateY: 5,
                                z: 50
                            }}
                            onClick={() => navigate(`/members/${member._id}`)}
                            className="member-card bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden border-2 border-white/50 cursor-pointer relative group"
                            style={{ 
                                transformStyle: 'preserve-3d',
                                boxShadow: '0 20px 50px rgba(0, 114, 206, 0.2), inset 0 -5px 20px rgba(0, 114, 206, 0.05)'
                            }}
                            data-aos="zoom-in"
                            data-aos-delay={index * 50}
                        >
                            {/* Animated gradient overlay */}
                            <motion.div
                                animate={{
                                    background: [
                                        'linear-gradient(135deg, rgba(0, 114, 206, 0.1), transparent)',
                                        'linear-gradient(225deg, rgba(0, 160, 220, 0.1), transparent)',
                                        'linear-gradient(315deg, rgba(0, 114, 206, 0.1), transparent)',
                                        'linear-gradient(45deg, rgba(0, 160, 220, 0.1), transparent)',
                                    ]
                                }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="absolute inset-0 pointer-events-none"
                            />

                            {/* Shine effect */}
                            <motion.div
                                animate={{
                                    x: ['-100%', '200%'],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    repeatDelay: 5,
                                }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 pointer-events-none"
                            />

                            {/* Avatar */}
                            <div className="relative h-64 overflow-hidden">
                                {member.avatar ? (
                                    <img
                                        src={member.avatar}
                                        alt={member.fullName}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-[#0072CE] to-[#003F87] flex items-center justify-center">
                                        <Users className="text-white" size={80} />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                
                                {/* Role Badge */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: index * 0.1 + 0.3 }}
                                    className="absolute top-4 right-4 px-4 py-2 bg-gradient-to-r from-[#0072CE] to-[#00A0DC] rounded-xl shadow-lg"
                                >
                                    <p className="text-white font-bold text-sm">{member.role}</p>
                                </motion.div>
                            </div>

                            {/* Info */}
                            <div className="p-6 relative z-10">
                                <h3 className="text-2xl font-black text-[#003F87] mb-2 group-hover:text-[#0072CE] transition-colors">
                                    {member.fullName}
                                </h3>
                                
                                {member.studentId && (
                                    <p className="text-gray-600 font-medium mb-2">MSSV: {member.studentId}</p>
                                )}
                                
                                {member.major && (
                                    <p className="text-gray-600 font-medium mb-2">{member.major}</p>
                                )}
                                
                                {member.bio && (
                                    <p className="text-gray-600 line-clamp-2 mb-4">{member.bio}</p>
                                )}

                                {/* View Button */}
                                <motion.div
                                    whileHover={{ x: 5 }}
                                    className="flex items-center gap-2 text-[#0072CE] font-bold"
                                >
                                    <span>Xem chi tiết</span>
                                    <ArrowRight size={20} />
                                </motion.div>
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
                                <Sparkles className="text-[#0072CE]/50" size={20} />
                            </motion.div>
                        </motion.div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredMembers.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20"
                    >
                        <motion.div
                            animate={{ 
                                rotate: 360,
                                scale: [1, 1.1, 1]
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center"
                        >
                            <Users className="text-gray-500" size={48} />
                        </motion.div>
                        <h3 className="text-2xl font-bold text-gray-600 mb-2">Không tìm thấy thành viên</h3>
                        <p className="text-gray-500">Thử tìm kiếm với từ khóa khác</p>
                    </motion.div>
                )}
            </div>
        </div>
    )
}
