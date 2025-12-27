import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { memberService } from '../../../services/memberService'
import type { Member } from '../../../types/member'
import { Github, Linkedin, Facebook, Instagram, Mail, ArrowLeft, Award, Briefcase, Globe, Calendar, Users, Heart, Sparkles, Star, Zap, Rocket, Trophy, Target, Code, BookOpen, GraduationCap } from 'lucide-react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import 'animate.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function MemberDetailPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [member, setMember] = useState<Member | null>(null)
    const [loading, setLoading] = useState(true)
    
    // Mouse tracking for 3D tilt effect
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)
    const heroRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    
    const rotateX = useSpring(useTransform(mouseY, [-300, 300], [5, -5]), { stiffness: 300, damping: 30 })
    const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-5, 5]), { stiffness: 300, damping: 30 })
    
    // Gradient animation
    const gradientX = useMotionValue(0)
    const gradientY = useMotionValue(0)
    
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!heroRef.current) return
        const rect = heroRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        mouseX.set(e.clientX - centerX)
        mouseY.set(e.clientY - centerY)
        
        // Update gradient position
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        gradientX.set(x)
        gradientY.set(y)
    }
    
    const handleMouseLeave = () => {
        mouseX.set(0)
        mouseY.set(0)
    }

    useEffect(() => {
        if (id) {
            fetchMember(id)
        }
        
        // Initialize AOS
        AOS.init({
            duration: 1200,
            once: false,
            mirror: true,
            easing: 'ease-out-cubic',
            offset: 50,
        })
        
        // GSAP Timeline animations
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.gsap-section',
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse',
                scrub: 1,
            }
        })
        
        tl.from('.gsap-fade-in', {
            opacity: 0,
            y: 100,
            scale: 0.9,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out'
        })
        
        // Floating animation for cards
        gsap.to('.float-card', {
            y: -20,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut',
            stagger: 0.3
        })
        
        // Rotate animation for icons
        gsap.to('.rotate-icon', {
            rotation: 360,
            duration: 20,
            repeat: -1,
            ease: 'none'
        })
        
        // Pulse animation
        gsap.to('.pulse-element', {
            scale: 1.1,
            opacity: 0.8,
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut',
            stagger: 0.2
        })
        
        return () => {
            AOS.refresh()
            ScrollTrigger.getAll().forEach(trigger => trigger.kill())
        }
    }, [id])

    const fetchMember = async (memberId: string) => {
        try {
            setLoading(true)
            const data = await memberService.getMemberById(memberId)
            setMember(data)
        } catch (error) {
            console.error('Error fetching member:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center relative overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0">
                    {[...Array(20)].map((_, i) => (
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
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-2 w-16 h-16 border-4 border-[#003F87] border-b-transparent rounded-full"
                    />
                </div>
            </div>
        )
    }

    if (!member) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-[#003F87] text-2xl font-bold">Không tìm thấy thành viên</div>
            </div>
        )
    }

    return (
        <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
            {/* Animated Background with Parallax */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Mega Floating Particles */}
                {[...Array(50)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            y: [0, -60, 0],
                            x: [0, Math.random() * 100 - 50, 0],
                            opacity: [0.1, 0.6, 0.1],
                            scale: [1, 2, 1],
                            rotate: [0, 360, 0]
                        }}
                        transition={{
                            duration: 5 + Math.random() * 8,
                            repeat: Infinity,
                            delay: Math.random() * 5,
                            ease: "easeInOut"
                        }}
                        className="absolute rounded-full blur-sm"
                        style={{
                            width: `${4 + Math.random() * 8}px`,
                            height: `${4 + Math.random() * 8}px`,
                            background: `linear-gradient(135deg, ${['#0072CE', '#00A0DC', '#003F87'][Math.floor(Math.random() * 3)]}, transparent)`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                    />
                ))}
                
                {/* Rotating Orbs */}
                <motion.div 
                    animate={{ 
                        y: [0, -80, 0], 
                        x: [0, 60, 0], 
                        rotate: [0, 360],
                        scale: [1, 1.3, 1]
                    }} 
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute top-20 left-20 w-[500px] h-[500px] bg-gradient-to-br from-[#0072CE]/20 to-[#00A0DC]/20 rounded-full blur-3xl" 
                />
                <motion.div 
                    animate={{ 
                        y: [0, 80, 0], 
                        x: [0, -70, 0], 
                        rotate: [360, 0],
                        scale: [1, 1.4, 1]
                    }} 
                    transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-20 right-20 w-[600px] h-[600px] bg-gradient-to-br from-[#003F87]/20 to-[#0072CE]/20 rounded-full blur-3xl" 
                />
                <motion.div 
                    animate={{ 
                        y: [0, -50, 0], 
                        x: [0, 50, 0], 
                        rotate: [0, -360],
                        scale: [1, 1.2, 1]
                    }} 
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-gradient-to-br from-[#00A0DC]/15 to-[#0072CE]/15 rounded-full blur-3xl" 
                />
                
                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0072CE08_1px,transparent_1px),linear-gradient(to_bottom,#0072CE08_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                
                {/* Mega Stars & Sparkles */}
                {[...Array(30)].map((_, i) => (
                    <motion.div
                        key={`star-${i}`}
                        animate={{
                            rotate: [0, 360],
                            scale: [1, 2.5, 1],
                            opacity: [0.2, 0.9, 0.2],
                            y: [0, -30, 0]
                        }}
                        transition={{
                            duration: 6 + Math.random() * 5,
                            repeat: Infinity,
                            delay: Math.random() * 4
                        }}
                        className="absolute"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                    >
                        {i % 3 === 0 ? (
                            <Star className="text-[#0072CE]/40" size={12 + Math.random() * 16} fill="currentColor" />
                        ) : i % 3 === 1 ? (
                            <Sparkles className="text-[#00A0DC]/40" size={12 + Math.random() * 16} />
                        ) : (
                            <Zap className="text-[#003F87]/40" size={12 + Math.random() * 16} fill="currentColor" />
                        )}
                    </motion.div>
                ))}
                
                {/* Lightning bolts */}
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={`zap-${i}`}
                        animate={{
                            opacity: [0, 0.7, 0],
                            scale: [0.8, 1.5, 0.8],
                            rotate: [0, 180, 360]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: i * 1.2,
                        }}
                        className="absolute"
                        style={{
                            left: `${15 + i * 12}%`,
                            top: `${10 + i * 15}%`,
                        }}
                    >
                        <Zap className="text-[#0072CE]/30" size={24} fill="currentColor" />
                    </motion.div>
                ))}
                
                {/* Rockets */}
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={`rocket-${i}`}
                        animate={{
                            y: [0, -100, 0],
                            x: [0, 50, 0],
                            rotate: [0, 360],
                            opacity: [0.2, 0.6, 0.2]
                        }}
                        transition={{
                            duration: 8 + i * 2,
                            repeat: Infinity,
                            delay: i * 2,
                        }}
                        className="absolute"
                        style={{
                            left: `${20 + i * 15}%`,
                            top: `${30 + i * 10}%`,
                        }}
                    >
                        <Rocket className="text-[#00A0DC]/30" size={20} />
                    </motion.div>
                ))}
            </div>

            {/* Back Button */}
            <div className="max-w-7xl mx-auto px-4 pt-8 relative z-10">
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.05, x: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/')}
                    className="flex items-center gap-3 px-6 py-3 bg-white/90 backdrop-blur-xl border-2 border-[#0072CE]/20 hover:border-[#0072CE]/40 rounded-2xl text-[#0072CE] font-bold transition-all shadow-lg hover:shadow-xl hover:shadow-[#0072CE]/20"
                >
                    <ArrowLeft size={20} />
                    <span>Quay lại</span>
                </motion.button>
            </div>

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    ref={heroRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                >
                    <motion.div
                        style={{
                            rotateX,
                            rotateY,
                            transformStyle: "preserve-3d",
                        }}
                        className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] overflow-hidden border border-white/50 relative group"
                        whileHover={{ scale: 1.01 }}
                    >
                        {/* Glassmorphism layers */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-transparent pointer-events-none"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-[#0072CE]/5 via-transparent to-[#003F87]/5 pointer-events-none"></div>
                        
                        {/* Animated glow */}
                        <motion.div
                            animate={{
                                opacity: [0.3, 0.6, 0.3],
                                scale: [1, 1.05, 1],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="absolute -inset-2 bg-gradient-to-r from-[#0072CE]/20 via-[#00A0DC]/20 to-[#0072CE]/20 rounded-[2.5rem] blur-2xl pointer-events-none"
                        />
                        
                        {/* Shine effect */}
                        <motion.div
                            animate={{
                                x: ['-100%', '200%'],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                repeatDelay: 6,
                                ease: "easeInOut"
                            }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 pointer-events-none"
                        />
                    
                    <div className="grid md:grid-cols-3 gap-10 p-10 relative" style={{ transform: 'translateZ(50px)' }}>
                        {/* Avatar */}
                        <div 
                            className="md:col-span-1"
                            data-aos="fade-right"
                            data-aos-duration="1000"
                            data-aos-delay="200"
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="relative group animate__animated animate__fadeInUp"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05, rotateY: 5 }}
                                    className="w-full aspect-square rounded-3xl overflow-hidden border-4 border-white shadow-2xl relative"
                                    style={{ 
                                        boxShadow: '0 25px 60px rgba(0, 114, 206, 0.4), inset 0 -10px 30px rgba(0, 0, 0, 0.1)',
                                        transformStyle: 'preserve-3d'
                                    }}
                                >
                                    {member.avatar ? (
                                        <img
                                            src={member.avatar}
                                            alt={member.fullName}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-[#0072CE] to-[#003F87] flex items-center justify-center">
                                            <Users className="text-white" size={120} />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#003F87]/30 to-transparent"></div>
                                    
                                    {/* Hover overlay */}
                                    <motion.div 
                                        className="absolute inset-0 bg-gradient-to-t from-[#0072CE]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        initial={{ opacity: 0 }}
                                        whileHover={{ opacity: 1 }}
                                    />
                                </motion.div>
                                
                                {/* Floating Globe Icon with sparkles */}
                                <motion.div
                                    animate={{ 
                                        rotate: 360,
                                        y: [0, -10, 0]
                                    }}
                                    transition={{ 
                                        rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                                        y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                                    }}
                                    whileHover={{ scale: 1.2 }}
                                    className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-[#0072CE] to-[#003F87] rounded-2xl flex items-center justify-center shadow-2xl relative"
                                    style={{ 
                                        boxShadow: '0 15px 40px rgba(0, 114, 206, 0.5), inset 0 -5px 15px rgba(0, 0, 0, 0.2)',
                                        transform: 'translateZ(30px)'
                                    }}
                                >
                                    <Globe className="text-white" size={36} />
                                    
                                    {/* Orbiting sparkles */}
                                    {[...Array(3)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            animate={{
                                                rotate: [0, 360],
                                            }}
                                            transition={{
                                                duration: 3,
                                                repeat: Infinity,
                                                delay: i * 1,
                                                ease: "linear"
                                            }}
                                            className="absolute inset-0"
                                        >
                                            <Sparkles 
                                                className="absolute text-[#00A0DC]" 
                                                size={12}
                                                style={{
                                                    left: `${50 + 50 * Math.cos((i * 2 * Math.PI) / 3)}%`,
                                                    top: `${50 + 50 * Math.sin((i * 2 * Math.PI) / 3)}%`,
                                                }}
                                            />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </motion.div>
                        </div>

                        {/* Info */}
                        <div 
                            className="md:col-span-2 flex flex-col justify-center space-y-6"
                            data-aos="fade-left"
                            data-aos-duration="1000"
                            data-aos-delay="400"
                        >
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="gsap-fade-in"
                            >
                                <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-[#003F87] via-[#0072CE] to-[#00A0DC] bg-clip-text text-transparent mb-4"
                                    style={{ textShadow: '0 2px 20px rgba(0, 114, 206, 0.2)' }}
                                >
                                    {member.fullName}
                                </h1>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="px-5 py-2 bg-gradient-to-r from-[#0072CE] to-[#00A0DC] rounded-2xl shadow-lg">
                                        <p className="text-xl font-bold text-white">{member.role || 'Member'}</p>
                                    </div>
                                </div>

                                {/* Student Info - MEGA 3D UPGRADE */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    {member.studentId && (
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                                            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                                            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                                            whileHover={{ 
                                                scale: 1.08, 
                                                rotateY: 5,
                                                z: 50,
                                                boxShadow: "0 25px 50px rgba(0, 114, 206, 0.4)"
                                            }}
                                            className="p-5 bg-gradient-to-br from-[#0072CE]/15 to-[#00A0DC]/15 rounded-2xl border-2 border-[#0072CE]/30 relative overflow-hidden group float-card"
                                            style={{ 
                                                transformStyle: 'preserve-3d',
                                                boxShadow: '0 15px 35px rgba(0, 114, 206, 0.2), inset 0 -5px 15px rgba(0, 114, 206, 0.1)'
                                            }}
                                        >
                                            {/* Animated background gradient */}
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
                                                className="absolute inset-0"
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
                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                                            />
                                            
                                            <div className="relative z-10">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                                    >
                                                        <GraduationCap className="text-[#0072CE]" size={20} />
                                                    </motion.div>
                                                    <p className="text-xs text-gray-600 font-bold uppercase tracking-wider">MSSV</p>
                                                </div>
                                                <motion.p 
                                                    className="text-2xl font-black text-[#003F87]"
                                                    whileHover={{ scale: 1.1 }}
                                                >
                                                    {member.studentId}
                                                </motion.p>
                                            </div>
                                            
                                            {/* Corner decoration */}
                                            <motion.div
                                                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                                                transition={{ duration: 10, repeat: Infinity }}
                                                className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-[#0072CE]/20 to-transparent rounded-full blur-xl"
                                            />
                                        </motion.div>
                                    )}
                                    
                                    {member.major && (
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                                            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                                            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                                            whileHover={{ 
                                                scale: 1.08, 
                                                rotateY: 5,
                                                z: 50,
                                                boxShadow: "0 25px 50px rgba(0, 160, 220, 0.4)"
                                            }}
                                            className="p-5 bg-gradient-to-br from-[#00A0DC]/15 to-[#0072CE]/15 rounded-2xl border-2 border-[#00A0DC]/30 relative overflow-hidden group float-card"
                                            style={{ 
                                                transformStyle: 'preserve-3d',
                                                boxShadow: '0 15px 35px rgba(0, 160, 220, 0.2), inset 0 -5px 15px rgba(0, 160, 220, 0.1)'
                                            }}
                                        >
                                            <motion.div
                                                animate={{
                                                    background: [
                                                        'linear-gradient(135deg, rgba(0, 160, 220, 0.1), transparent)',
                                                        'linear-gradient(225deg, rgba(0, 114, 206, 0.1), transparent)',
                                                        'linear-gradient(315deg, rgba(0, 160, 220, 0.1), transparent)',
                                                        'linear-gradient(45deg, rgba(0, 114, 206, 0.1), transparent)',
                                                    ]
                                                }}
                                                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                                                className="absolute inset-0"
                                            />
                                            
                                            <motion.div
                                                animate={{
                                                    x: ['-100%', '200%'],
                                                }}
                                                transition={{
                                                    duration: 3,
                                                    repeat: Infinity,
                                                    repeatDelay: 5,
                                                    delay: 1
                                                }}
                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                                            />
                                            
                                            <div className="relative z-10">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <motion.div
                                                        animate={{ rotate: -360 }}
                                                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                                    >
                                                        <BookOpen className="text-[#00A0DC]" size={20} />
                                                    </motion.div>
                                                    <p className="text-xs text-gray-600 font-bold uppercase tracking-wider">Ngành học</p>
                                                </div>
                                                <motion.p 
                                                    className="text-2xl font-black text-[#003F87]"
                                                    whileHover={{ scale: 1.1 }}
                                                >
                                                    {member.major}
                                                </motion.p>
                                            </div>
                                            
                                            <motion.div
                                                animate={{ rotate: -360, scale: [1, 1.2, 1] }}
                                                transition={{ duration: 12, repeat: Infinity }}
                                                className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-[#00A0DC]/20 to-transparent rounded-full blur-xl"
                                            />
                                        </motion.div>
                                    )}
                                    
                                    {member.year && (
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                                            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                                            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                                            whileHover={{ 
                                                scale: 1.08, 
                                                rotateY: 5,
                                                z: 50,
                                                boxShadow: "0 25px 50px rgba(0, 63, 135, 0.4)"
                                            }}
                                            className="p-5 bg-gradient-to-br from-[#003F87]/15 to-[#0072CE]/15 rounded-2xl border-2 border-[#003F87]/30 relative overflow-hidden group float-card"
                                            style={{ 
                                                transformStyle: 'preserve-3d',
                                                boxShadow: '0 15px 35px rgba(0, 63, 135, 0.2), inset 0 -5px 15px rgba(0, 63, 135, 0.1)'
                                            }}
                                        >
                                            <motion.div
                                                animate={{
                                                    background: [
                                                        'linear-gradient(135deg, rgba(0, 63, 135, 0.1), transparent)',
                                                        'linear-gradient(225deg, rgba(0, 114, 206, 0.1), transparent)',
                                                        'linear-gradient(315deg, rgba(0, 63, 135, 0.1), transparent)',
                                                        'linear-gradient(45deg, rgba(0, 114, 206, 0.1), transparent)',
                                                    ]
                                                }}
                                                transition={{ duration: 4, repeat: Infinity, delay: 2 }}
                                                className="absolute inset-0"
                                            />
                                            
                                            <motion.div
                                                animate={{
                                                    x: ['-100%', '200%'],
                                                }}
                                                transition={{
                                                    duration: 3,
                                                    repeat: Infinity,
                                                    repeatDelay: 5,
                                                    delay: 2
                                                }}
                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                                            />
                                            
                                            <div className="relative z-10">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <motion.div
                                                        animate={{ 
                                                            rotate: 360,
                                                            scale: [1, 1.2, 1]
                                                        }}
                                                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                                    >
                                                        <Target className="text-[#003F87]" size={20} />
                                                    </motion.div>
                                                    <p className="text-xs text-gray-600 font-bold uppercase tracking-wider">Năm học</p>
                                                </div>
                                                <motion.p 
                                                    className="text-2xl font-black text-[#003F87]"
                                                    whileHover={{ scale: 1.1 }}
                                                >
                                                    {member.year}
                                                </motion.p>
                                            </div>
                                            
                                            <motion.div
                                                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                                                transition={{ duration: 8, repeat: Infinity }}
                                                className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-[#003F87]/20 to-transparent rounded-full blur-xl"
                                            />
                                        </motion.div>
                                    )}
                                </div>
                                
                                {/* New Fields - English Name, Class, Nationality, Date of Birth */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    {member.englishName && (
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                                            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                                            transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                                            whileHover={{ 
                                                scale: 1.08, 
                                                rotateY: 5,
                                                z: 50,
                                                boxShadow: "0 25px 50px rgba(0, 114, 206, 0.4)"
                                            }}
                                            className="p-5 bg-gradient-to-br from-[#0072CE]/15 to-[#00A0DC]/15 rounded-2xl border-2 border-[#0072CE]/30 relative overflow-hidden group float-card"
                                            style={{ 
                                                transformStyle: 'preserve-3d',
                                                boxShadow: '0 15px 35px rgba(0, 114, 206, 0.2), inset 0 -5px 15px rgba(0, 114, 206, 0.1)'
                                            }}
                                        >
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
                                                className="absolute inset-0"
                                            />
                                            
                                            <motion.div
                                                animate={{
                                                    x: ['-100%', '200%'],
                                                }}
                                                transition={{
                                                    duration: 3,
                                                    repeat: Infinity,
                                                    repeatDelay: 5,
                                                }}
                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                                            />
                                            
                                            <div className="relative z-10">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                                    >
                                                        <Globe className="text-[#0072CE]" size={20} />
                                                    </motion.div>
                                                    <p className="text-xs text-gray-600 font-bold uppercase tracking-wider">Tên tiếng Anh</p>
                                                </div>
                                                <motion.p 
                                                    className="text-2xl font-black text-[#003F87]"
                                                    whileHover={{ scale: 1.1 }}
                                                >
                                                    {member.englishName}
                                                </motion.p>
                                            </div>
                                            
                                            <motion.div
                                                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                                                transition={{ duration: 10, repeat: Infinity }}
                                                className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-[#0072CE]/20 to-transparent rounded-full blur-xl"
                                            />
                                        </motion.div>
                                    )}
                                    
                                    {member.class && (
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                                            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                                            transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
                                            whileHover={{ 
                                                scale: 1.08, 
                                                rotateY: 5,
                                                z: 50,
                                                boxShadow: "0 25px 50px rgba(0, 160, 220, 0.4)"
                                            }}
                                            className="p-5 bg-gradient-to-br from-[#00A0DC]/15 to-[#0072CE]/15 rounded-2xl border-2 border-[#00A0DC]/30 relative overflow-hidden group float-card"
                                            style={{ 
                                                transformStyle: 'preserve-3d',
                                                boxShadow: '0 15px 35px rgba(0, 160, 220, 0.2), inset 0 -5px 15px rgba(0, 160, 220, 0.1)'
                                            }}
                                        >
                                            <motion.div
                                                animate={{
                                                    background: [
                                                        'linear-gradient(135deg, rgba(0, 160, 220, 0.1), transparent)',
                                                        'linear-gradient(225deg, rgba(0, 114, 206, 0.1), transparent)',
                                                        'linear-gradient(315deg, rgba(0, 160, 220, 0.1), transparent)',
                                                        'linear-gradient(45deg, rgba(0, 114, 206, 0.1), transparent)',
                                                    ]
                                                }}
                                                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                                                className="absolute inset-0"
                                            />
                                            
                                            <motion.div
                                                animate={{
                                                    x: ['-100%', '200%'],
                                                }}
                                                transition={{
                                                    duration: 3,
                                                    repeat: Infinity,
                                                    repeatDelay: 5,
                                                    delay: 1
                                                }}
                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                                            />
                                            
                                            <div className="relative z-10">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <motion.div
                                                        animate={{ rotate: -360 }}
                                                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                                    >
                                                        <Users className="text-[#00A0DC]" size={20} />
                                                    </motion.div>
                                                    <p className="text-xs text-gray-600 font-bold uppercase tracking-wider">Lớp</p>
                                                </div>
                                                <motion.p 
                                                    className="text-2xl font-black text-[#003F87]"
                                                    whileHover={{ scale: 1.1 }}
                                                >
                                                    {member.class}
                                                </motion.p>
                                            </div>
                                            
                                            <motion.div
                                                animate={{ rotate: -360, scale: [1, 1.2, 1] }}
                                                transition={{ duration: 12, repeat: Infinity }}
                                                className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-[#00A0DC]/20 to-transparent rounded-full blur-xl"
                                            />
                                        </motion.div>
                                    )}
                                    
                                    {member.nationality && (
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                                            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                                            transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                                            whileHover={{ 
                                                scale: 1.08, 
                                                rotateY: 5,
                                                z: 50,
                                                boxShadow: "0 25px 50px rgba(0, 63, 135, 0.4)"
                                            }}
                                            className="p-5 bg-gradient-to-br from-[#003F87]/15 to-[#0072CE]/15 rounded-2xl border-2 border-[#003F87]/30 relative overflow-hidden group float-card"
                                            style={{ 
                                                transformStyle: 'preserve-3d',
                                                boxShadow: '0 15px 35px rgba(0, 63, 135, 0.2), inset 0 -5px 15px rgba(0, 63, 135, 0.1)'
                                            }}
                                        >
                                            <motion.div
                                                animate={{
                                                    background: [
                                                        'linear-gradient(135deg, rgba(0, 63, 135, 0.1), transparent)',
                                                        'linear-gradient(225deg, rgba(0, 114, 206, 0.1), transparent)',
                                                        'linear-gradient(315deg, rgba(0, 63, 135, 0.1), transparent)',
                                                        'linear-gradient(45deg, rgba(0, 114, 206, 0.1), transparent)',
                                                    ]
                                                }}
                                                transition={{ duration: 4, repeat: Infinity, delay: 2 }}
                                                className="absolute inset-0"
                                            />
                                            
                                            <motion.div
                                                animate={{
                                                    x: ['-100%', '200%'],
                                                }}
                                                transition={{
                                                    duration: 3,
                                                    repeat: Infinity,
                                                    repeatDelay: 5,
                                                    delay: 2
                                                }}
                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                                            />
                                            
                                            <div className="relative z-10">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <motion.div
                                                        animate={{ 
                                                            rotate: 360,
                                                            scale: [1, 1.2, 1]
                                                        }}
                                                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                                    >
                                                        <Globe className="text-[#003F87]" size={20} />
                                                    </motion.div>
                                                    <p className="text-xs text-gray-600 font-bold uppercase tracking-wider">Quốc tịch</p>
                                                </div>
                                                <motion.p 
                                                    className="text-2xl font-black text-[#003F87]"
                                                    whileHover={{ scale: 1.1 }}
                                                >
                                                    {member.nationality}
                                                </motion.p>
                                            </div>
                                            
                                            <motion.div
                                                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                                                transition={{ duration: 8, repeat: Infinity }}
                                                className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-[#003F87]/20 to-transparent rounded-full blur-xl"
                                            />
                                        </motion.div>
                                    )}
                                    
                                    {member.dateOfBirth && (
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                                            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                                            transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
                                            whileHover={{ 
                                                scale: 1.08, 
                                                rotateY: 5,
                                                z: 50,
                                                boxShadow: "0 25px 50px rgba(0, 114, 206, 0.4)"
                                            }}
                                            className="p-5 bg-gradient-to-br from-[#0072CE]/15 to-[#00A0DC]/15 rounded-2xl border-2 border-[#0072CE]/30 relative overflow-hidden group float-card"
                                            style={{ 
                                                transformStyle: 'preserve-3d',
                                                boxShadow: '0 15px 35px rgba(0, 114, 206, 0.2), inset 0 -5px 15px rgba(0, 114, 206, 0.1)'
                                            }}
                                        >
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
                                                className="absolute inset-0"
                                            />
                                            
                                            <motion.div
                                                animate={{
                                                    x: ['-100%', '200%'],
                                                }}
                                                transition={{
                                                    duration: 3,
                                                    repeat: Infinity,
                                                    repeatDelay: 5,
                                                }}
                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                                            />
                                            
                                            <div className="relative z-10">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                                    >
                                                        <Calendar className="text-[#0072CE]" size={20} />
                                                    </motion.div>
                                                    <p className="text-xs text-gray-600 font-bold uppercase tracking-wider">Ngày sinh</p>
                                                </div>
                                                <motion.p 
                                                    className="text-2xl font-black text-[#003F87]"
                                                    whileHover={{ scale: 1.1 }}
                                                >
                                                    {new Date(member.dateOfBirth).toLocaleDateString('vi-VN')}
                                                </motion.p>
                                            </div>
                                            
                                            <motion.div
                                                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                                                transition={{ duration: 10, repeat: Infinity }}
                                                className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-[#0072CE]/20 to-transparent rounded-full blur-xl"
                                            />
                                        </motion.div>
                                    )}
                                </div>

                                {member.quote && (
                                    <div className="p-5 bg-gradient-to-r from-[#0072CE]/10 to-[#00A0DC]/10 rounded-2xl border-l-4 border-[#0072CE] mb-4">
                                        <p className="text-lg italic text-[#003F87] font-medium">"{member.quote}"</p>
                                    </div>
                                )}
                                {member.bio && (
                                    <p className="text-xl text-gray-700 leading-relaxed">{member.bio}</p>
                                )}
                            </motion.div>

                            {/* Stats - MEGA 3D UPGRADE */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="grid grid-cols-3 gap-5 gsap-section"
                                data-aos="zoom-in"
                                data-aos-duration="1000"
                                data-aos-delay="600"
                            >
                                {member.eventsAttended !== undefined && (
                                    <motion.div 
                                        whileHover={{ 
                                            scale: 1.1, 
                                            rotateY: 10,
                                            z: 50
                                        }}
                                        className="p-6 bg-gradient-to-br from-[#0072CE]/15 to-[#00A0DC]/15 rounded-3xl border-2 border-[#0072CE]/30 text-center relative overflow-hidden group float-card"
                                        style={{ 
                                            transformStyle: 'preserve-3d',
                                            boxShadow: '0 20px 40px rgba(0, 114, 206, 0.3), inset 0 -5px 20px rgba(0, 114, 206, 0.1)'
                                        }}
                                    >
                                        {/* Animated orb */}
                                        <motion.div
                                            animate={{
                                                scale: [1, 1.5, 1],
                                                opacity: [0.3, 0.6, 0.3]
                                            }}
                                            transition={{ duration: 3, repeat: Infinity }}
                                            className="absolute inset-0 bg-gradient-to-br from-[#0072CE]/20 to-transparent rounded-3xl"
                                        />
                                        
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                            className="mx-auto mb-3 w-14 h-14 bg-gradient-to-br from-[#0072CE] to-[#00A0DC] rounded-2xl flex items-center justify-center shadow-xl relative z-10 rotate-icon"
                                            style={{ boxShadow: '0 10px 25px rgba(0, 114, 206, 0.5)' }}
                                        >
                                            <Calendar className="text-white" size={28} />
                                        </motion.div>
                                        
                                        <motion.p 
                                            className="text-4xl font-black text-[#003F87] mb-2 relative z-10"
                                            animate={{ scale: [1, 1.1, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            {member.eventsAttended}
                                        </motion.p>
                                        <p className="text-sm text-gray-700 font-bold relative z-10">Sự kiện đã tham gia</p>
                                        
                                        {/* Corner sparkles */}
                                        <motion.div
                                            animate={{ 
                                                rotate: 360,
                                                scale: [1, 1.5, 1]
                                            }}
                                            transition={{ duration: 5, repeat: Infinity }}
                                            className="absolute top-2 right-2"
                                        >
                                            <Sparkles className="text-[#0072CE]/50" size={16} />
                                        </motion.div>
                                    </motion.div>
                                )}
                                
                                {member.foreignersMet !== undefined && (
                                    <motion.div 
                                        whileHover={{ 
                                            scale: 1.1, 
                                            rotateY: 10,
                                            z: 50
                                        }}
                                        className="p-6 bg-gradient-to-br from-[#00A0DC]/15 to-[#0072CE]/15 rounded-3xl border-2 border-[#00A0DC]/30 text-center relative overflow-hidden group float-card"
                                        style={{ 
                                            transformStyle: 'preserve-3d',
                                            boxShadow: '0 20px 40px rgba(0, 160, 220, 0.3), inset 0 -5px 20px rgba(0, 160, 220, 0.1)'
                                        }}
                                    >
                                        <motion.div
                                            animate={{
                                                scale: [1, 1.5, 1],
                                                opacity: [0.3, 0.6, 0.3]
                                            }}
                                            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                                            className="absolute inset-0 bg-gradient-to-br from-[#00A0DC]/20 to-transparent rounded-3xl"
                                        />
                                        
                                        <motion.div
                                            animate={{ rotate: -360 }}
                                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                            className="mx-auto mb-3 w-14 h-14 bg-gradient-to-br from-[#00A0DC] to-[#0072CE] rounded-2xl flex items-center justify-center shadow-xl relative z-10 rotate-icon"
                                            style={{ boxShadow: '0 10px 25px rgba(0, 160, 220, 0.5)' }}
                                        >
                                            <Users className="text-white" size={28} />
                                        </motion.div>
                                        
                                        <motion.p 
                                            className="text-4xl font-black text-[#003F87] mb-2 relative z-10"
                                            animate={{ scale: [1, 1.1, 1] }}
                                            transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                                        >
                                            {member.foreignersMet}
                                        </motion.p>
                                        <p className="text-sm text-gray-700 font-bold relative z-10">Bạn quốc tế</p>
                                        
                                        <motion.div
                                            animate={{ 
                                                rotate: -360,
                                                scale: [1, 1.5, 1]
                                            }}
                                            transition={{ duration: 6, repeat: Infinity }}
                                            className="absolute top-2 right-2"
                                        >
                                            <Star className="text-[#00A0DC]/50" size={16} fill="currentColor" />
                                        </motion.div>
                                    </motion.div>
                                )}
                                
                                {member.joinYear && (
                                    <motion.div 
                                        whileHover={{ 
                                            scale: 1.1, 
                                            rotateY: 10,
                                            z: 50
                                        }}
                                        className="p-6 bg-gradient-to-br from-[#003F87]/15 to-[#0072CE]/15 rounded-3xl border-2 border-[#003F87]/30 text-center relative overflow-hidden group float-card"
                                        style={{ 
                                            transformStyle: 'preserve-3d',
                                            boxShadow: '0 20px 40px rgba(0, 63, 135, 0.3), inset 0 -5px 20px rgba(0, 63, 135, 0.1)'
                                        }}
                                    >
                                        <motion.div
                                            animate={{
                                                scale: [1, 1.5, 1],
                                                opacity: [0.3, 0.6, 0.3]
                                            }}
                                            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                                            className="absolute inset-0 bg-gradient-to-br from-[#003F87]/20 to-transparent rounded-3xl"
                                        />
                                        
                                        <motion.div
                                            animate={{ 
                                                rotate: 360,
                                                scale: [1, 1.1, 1]
                                            }}
                                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                            className="mx-auto mb-3 w-14 h-14 bg-gradient-to-br from-[#003F87] to-[#0072CE] rounded-2xl flex items-center justify-center shadow-xl relative z-10 rotate-icon"
                                            style={{ boxShadow: '0 10px 25px rgba(0, 63, 135, 0.5)' }}
                                        >
                                            <Trophy className="text-white" size={28} />
                                        </motion.div>
                                        
                                        <motion.p 
                                            className="text-4xl font-black text-[#003F87] mb-2 relative z-10"
                                            animate={{ scale: [1, 1.1, 1] }}
                                            transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                                        >
                                            {member.joinYear}
                                        </motion.p>
                                        <p className="text-sm text-gray-700 font-bold relative z-10">Tham gia</p>
                                        
                                        <motion.div
                                            animate={{ 
                                                rotate: 360,
                                                scale: [1, 1.5, 1]
                                            }}
                                            transition={{ duration: 7, repeat: Infinity }}
                                            className="absolute top-2 right-2"
                                        >
                                            <Zap className="text-[#003F87]/50" size={16} fill="currentColor" />
                                        </motion.div>
                                    </motion.div>
                                )}
                            </motion.div>

                            {/* Social Links */}
                            {member.socialLinks && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="flex flex-wrap gap-3 animate__animated animate__bounceIn animate__delay-1s"
                                    data-aos="fade-up"
                                    data-aos-duration="600"
                                    data-aos-delay="800"
                                >
                                    {member.socialLinks.facebook && (
                                        <motion.a
                                            whileHover={{ scale: 1.1, y: -3 }}
                                            whileTap={{ scale: 0.95 }}
                                            href={member.socialLinks.facebook}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-2xl transition-all shadow-lg hover:shadow-xl"
                                            style={{ boxShadow: '0 8px 20px rgba(59, 130, 246, 0.4)' }}
                                        >
                                            <Facebook size={24} className="text-white" />
                                        </motion.a>
                                    )}
                                    {member.socialLinks.instagram && (
                                        <motion.a
                                            whileHover={{ scale: 1.1, y: -3 }}
                                            whileTap={{ scale: 0.95 }}
                                            href={member.socialLinks.instagram}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-4 bg-gradient-to-br from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-2xl transition-all shadow-lg hover:shadow-xl"
                                            style={{ boxShadow: '0 8px 20px rgba(236, 72, 153, 0.4)' }}
                                        >
                                            <Instagram size={24} className="text-white" />
                                        </motion.a>
                                    )}
                                    {member.socialLinks.linkedin && (
                                        <motion.a
                                            whileHover={{ scale: 1.1, y: -3 }}
                                            whileTap={{ scale: 0.95 }}
                                            href={member.socialLinks.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-4 bg-gradient-to-br from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 rounded-2xl transition-all shadow-lg hover:shadow-xl"
                                            style={{ boxShadow: '0 8px 20px rgba(14, 165, 233, 0.4)' }}
                                        >
                                            <Linkedin size={24} className="text-white" />
                                        </motion.a>
                                    )}
                                    {member.socialLinks.github && (
                                        <motion.a
                                            whileHover={{ scale: 1.1, y: -3 }}
                                            whileTap={{ scale: 0.95 }}
                                            href={member.socialLinks.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-4 bg-gradient-to-br from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black rounded-2xl transition-all shadow-lg hover:shadow-xl"
                                            style={{ boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)' }}
                                        >
                                            <Github size={24} className="text-white" />
                                        </motion.a>
                                    )}
                                    {member.socialLinks.email && (
                                        <motion.a
                                            whileHover={{ scale: 1.1, y: -3 }}
                                            whileTap={{ scale: 0.95 }}
                                            href={`mailto:${member.socialLinks.email}`}
                                            className="p-4 bg-gradient-to-br from-[#0072CE] to-[#003F87] hover:from-[#005BA8] hover:to-[#002855] rounded-2xl transition-all shadow-lg hover:shadow-xl"
                                            style={{ boxShadow: '0 8px 20px rgba(0, 114, 206, 0.4)' }}
                                        >
                                            <Mail size={24} className="text-white" />
                                        </motion.a>
                                    )}
                                </motion.div>
                            )}

                            {/* Skills - MEGA 3D UPGRADE */}
                            {member.skills && member.skills.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="gsap-section"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <motion.div
                                            animate={{ 
                                                rotate: [0, 360],
                                                scale: [1, 1.2, 1]
                                            }}
                                            transition={{ duration: 10, repeat: Infinity }}
                                            className="w-10 h-10 bg-gradient-to-br from-[#0072CE] to-[#00A0DC] rounded-xl flex items-center justify-center shadow-lg rotate-icon"
                                            style={{ boxShadow: '0 8px 20px rgba(0, 114, 206, 0.4)' }}
                                        >
                                            <Code className="text-white" size={20} />
                                        </motion.div>
                                        <h3 className="text-[#003F87] font-black text-2xl">Kỹ năng</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {member.skills.map((skill, i) => (
                                            <motion.span
                                                key={i}
                                                initial={{ opacity: 0, scale: 0, rotateX: -90 }}
                                                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                                                transition={{ 
                                                    delay: 0.7 + i * 0.08,
                                                    type: "spring",
                                                    stiffness: 300
                                                }}
                                                whileHover={{ 
                                                    scale: 1.15,
                                                    rotateZ: [0, -5, 5, 0],
                                                    y: -8,
                                                    boxShadow: "0 15px 30px rgba(0, 114, 206, 0.4)"
                                                }}
                                                whileTap={{ scale: 0.95 }}
                                                className="px-6 py-3 bg-gradient-to-br from-[#0072CE]/20 to-[#00A0DC]/20 text-[#003F87] rounded-2xl text-base font-black border-2 border-[#0072CE]/40 relative overflow-hidden group cursor-pointer"
                                                style={{ 
                                                    transformStyle: 'preserve-3d',
                                                    boxShadow: '0 8px 20px rgba(0, 114, 206, 0.2), inset 0 -3px 10px rgba(0, 114, 206, 0.1)'
                                                }}
                                            >
                                                {/* Animated background */}
                                                <motion.div
                                                    animate={{
                                                        x: ['-100%', '100%']
                                                    }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        repeatDelay: 3
                                                    }}
                                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0072CE]/20 to-transparent"
                                                />
                                                
                                                {/* Sparkle effect */}
                                                <motion.div
                                                    animate={{
                                                        scale: [0, 1, 0],
                                                        rotate: [0, 180, 360]
                                                    }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        delay: i * 0.5
                                                    }}
                                                    className="absolute top-1 right-1"
                                                >
                                                    <Sparkles className="text-[#00A0DC]" size={12} />
                                                </motion.div>
                                                
                                                <span className="relative z-10">{skill}</span>
                                            </motion.span>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                            
                            {/* Interests - MEGA 3D UPGRADE */}
                            {member.interests && member.interests.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 }}
                                    className="gsap-section"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <motion.div
                                            animate={{ 
                                                scale: [1, 1.3, 1],
                                                rotate: [0, 360]
                                            }}
                                            transition={{ duration: 8, repeat: Infinity }}
                                            className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg pulse-element"
                                            style={{ boxShadow: '0 8px 20px rgba(236, 72, 153, 0.4)' }}
                                        >
                                            <Heart className="text-white" size={20} fill="currentColor" />
                                        </motion.div>
                                        <h3 className="text-purple-700 font-black text-2xl">Sở thích</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {member.interests.map((interest, i) => (
                                            <motion.span
                                                key={i}
                                                initial={{ opacity: 0, scale: 0, rotateX: -90 }}
                                                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                                                transition={{ 
                                                    delay: 0.8 + i * 0.08,
                                                    type: "spring",
                                                    stiffness: 300
                                                }}
                                                whileHover={{ 
                                                    scale: 1.15,
                                                    rotateZ: [0, 5, -5, 0],
                                                    y: -8,
                                                    boxShadow: "0 15px 30px rgba(236, 72, 153, 0.4)"
                                                }}
                                                whileTap={{ scale: 0.95 }}
                                                className="px-6 py-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-purple-700 rounded-2xl text-base font-black border-2 border-purple-400/50 relative overflow-hidden group cursor-pointer"
                                                style={{ 
                                                    transformStyle: 'preserve-3d',
                                                    boxShadow: '0 8px 20px rgba(168, 85, 247, 0.2), inset 0 -3px 10px rgba(236, 72, 153, 0.1)'
                                                }}
                                            >
                                                {/* Animated background */}
                                                <motion.div
                                                    animate={{
                                                        x: ['-100%', '100%']
                                                    }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        repeatDelay: 3,
                                                        delay: 0.5
                                                    }}
                                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-500/20 to-transparent"
                                                />
                                                
                                                {/* Heart effect */}
                                                <motion.div
                                                    animate={{
                                                        scale: [0, 1.2, 0],
                                                        y: [0, -20, -40],
                                                        opacity: [1, 0.5, 0]
                                                    }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        delay: i * 0.6
                                                    }}
                                                    className="absolute top-1 right-1"
                                                >
                                                    <Heart className="text-pink-500" size={10} fill="currentColor" />
                                                </motion.div>
                                                
                                                <span className="relative z-10">{interest}</span>
                                            </motion.span>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Description */}
            {member.description && (
                <div 
                    className="max-w-7xl mx-auto px-4 mb-12 relative z-10"
                    data-aos="fade-up"
                    data-aos-duration="1000"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="bg-white/80 backdrop-blur-2xl rounded-[2rem] p-10 border border-white/50 gsap-fade-in animate__animated animate__fadeInUp"
                        style={{ boxShadow: '0 20px 50px rgba(0, 114, 206, 0.2)' }}
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#0072CE] to-[#003F87] rounded-2xl flex items-center justify-center shadow-lg">
                                <Users className="text-white" size={24} />
                            </div>
                            <h2 className="text-4xl font-black text-[#003F87]">Giới thiệu</h2>
                        </div>
                        <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">{member.description}</p>
                    </motion.div>
                </div>
            )}

            {/* Achievements */}
            {member.achievements && member.achievements.length > 0 && (
                <div 
                    className="max-w-7xl mx-auto px-4 mb-12 relative z-10"
                    data-aos="fade-right"
                    data-aos-duration="1000"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="bg-white/80 backdrop-blur-2xl rounded-[2rem] p-10 border border-white/50 gsap-fade-in animate__animated animate__slideInLeft"
                        style={{ boxShadow: '0 20px 50px rgba(245, 158, 11, 0.2)' }}
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg"
                                style={{ boxShadow: '0 8px 20px rgba(245, 158, 11, 0.4)' }}
                            >
                                <Award className="text-white" size={24} />
                            </div>
                            <h2 className="text-4xl font-black text-[#003F87]">Thành tựu</h2>
                        </div>
                        <div className="space-y-5">
                            {member.achievements.map((achievement, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 1 + i * 0.1 }}
                                    whileHover={{ scale: 1.02, x: 10 }}
                                    className="p-6 bg-gradient-to-br from-amber-50/80 to-orange-50/80 rounded-2xl border-2 border-amber-200/50 relative overflow-hidden"
                                    style={{ boxShadow: '0 8px 25px rgba(245, 158, 11, 0.15)' }}
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/10 to-transparent rounded-full blur-2xl"></div>
                                    <div className="flex items-start gap-5 relative">
                                        <div className="px-5 py-3 bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-2xl font-black text-lg shadow-lg min-w-[80px] text-center">
                                            {achievement.year}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-black text-[#003F87] mb-2">{achievement.title}</h3>
                                            {achievement.description && (
                                                <p className="text-gray-700 leading-relaxed">{achievement.description}</p>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Projects */}
            {member.projects && member.projects.length > 0 && (
                <div 
                    className="max-w-7xl mx-auto px-4 pb-12 relative z-10"
                    data-aos="fade-left"
                    data-aos-duration="1000"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                        className="bg-white/80 backdrop-blur-2xl rounded-[2rem] p-10 border border-white/50 gsap-fade-in animate__animated animate__slideInRight"
                        style={{ boxShadow: '0 20px 50px rgba(0, 114, 206, 0.2)' }}
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#0072CE] to-[#003F87] rounded-2xl flex items-center justify-center shadow-lg"
                                style={{ boxShadow: '0 8px 20px rgba(0, 114, 206, 0.4)' }}
                            >
                                <Briefcase className="text-white" size={24} />
                            </div>
                            <h2 className="text-4xl font-black text-[#003F87]">Dự án</h2>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            {member.projects.map((project, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 1.1 + i * 0.1 }}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    className="bg-gradient-to-br from-[#0072CE]/5 to-[#00A0DC]/5 rounded-2xl p-6 border-2 border-[#0072CE]/20 overflow-hidden relative"
                                    style={{ boxShadow: '0 10px 30px rgba(0, 114, 206, 0.15)' }}
                                >
                                    {project.image && (
                                        <div className="mb-5 rounded-xl overflow-hidden border-2 border-white shadow-lg">
                                            <img
                                                src={project.image}
                                                alt={project.name}
                                                className="w-full h-52 object-cover"
                                            />
                                        </div>
                                    )}
                                    <h3 className="text-2xl font-black text-[#003F87] mb-3">{project.name}</h3>
                                    <p className="text-gray-700 mb-5 leading-relaxed">{project.description}</p>
                                    {project.link && (
                                        <motion.a
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            href={project.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0072CE] to-[#00A0DC] hover:from-[#005BA8] hover:to-[#0088BB] text-white font-bold rounded-xl transition-all shadow-lg"
                                            style={{ boxShadow: '0 6px 20px rgba(0, 114, 206, 0.4)' }}
                                        >
                                            Xem dự án →
                                        </motion.a>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    )
}
