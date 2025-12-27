import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Info, Globe, Users, Star, Sparkles, Zap, Rocket, Heart, Trophy } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useState } from 'react'
import authService from '@/services/authService'
import type { LoginRequest } from '@/services/authService'
import LoadingIcon from '@/components/ui/loading-icon'
import { motion } from 'framer-motion'
import { TokenStorage } from '@/contexts/AuthContext'

export default function LoginPage() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    
    const formik = useFormik<LoginRequest>({
        initialValues: {
            username: '',
            password: '',
            type: 'member',
        },
        validationSchema: Yup.object({
            username: Yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
            password: Yup.string().required('Vui lòng nhập password'),
        }),
        onSubmit: (values) => {
            handleLogin(values)
        },
    })

    const handleLogin = async (values: LoginRequest) => {
        try {
            setLoading(true)
            const response = await authService.login({ ...values, type: 'member' })
            
            TokenStorage.setCookieToken(response.accessToken)
            TokenStorage.setRefreshToken(response.refreshToken)
            
            if (response.member) {
                TokenStorage.setUser(response.member as any)
            }
            
            navigate('/profile')
        } catch (error: any) {
            let errorMessage = 'Email hoặc mật khẩu không đúng'
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message
            } else if (error.message) {
                errorMessage = error.message
            }
            setErrorMessage(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
            {/* MEGA Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Floating Particles */}
                {[...Array(50)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            y: [0, -60, 0],
                            x: [0, Math.random() * 100 - 50, 0],
                            opacity: [0.1, 0.6, 0.1],
                            scale: [1, 2.5, 1],
                            rotate: [0, 360, 0]
                        }}
                        transition={{
                            duration: 8 + Math.random() * 8,
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

                {/* Mega Orbs */}
                <motion.div 
                    animate={{ 
                        y: [0, -80, 0], 
                        x: [0, 60, 0], 
                        rotate: [0, 360],
                        scale: [1, 1.4, 1]
                    }} 
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute top-20 left-20 w-[600px] h-[600px] bg-gradient-to-br from-[#0072CE]/20 to-[#00A0DC]/20 rounded-full blur-3xl" 
                />
                <motion.div 
                    animate={{ 
                        y: [0, 90, 0], 
                        x: [0, -70, 0], 
                        rotate: [360, 0],
                        scale: [1, 1.5, 1]
                    }} 
                    transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-20 right-20 w-[700px] h-[700px] bg-gradient-to-br from-[#003F87]/20 to-[#0072CE]/20 rounded-full blur-3xl" 
                />

                {/* Stars & Icons */}
                {[...Array(30)].map((_, i) => (
                    <motion.div
                        key={`icon-${i}`}
                        animate={{
                            rotate: [0, 360],
                            scale: [1, 2.5, 1],
                            opacity: [0.2, 0.8, 0.2]
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
                        {i % 5 === 0 ? (
                            <Star className="text-[#0072CE]/40" size={14 + Math.random() * 14} fill="currentColor" />
                        ) : i % 5 === 1 ? (
                            <Sparkles className="text-[#00A0DC]/40" size={14 + Math.random() * 14} />
                        ) : i % 5 === 2 ? (
                            <Zap className="text-[#003F87]/40" size={14 + Math.random() * 14} fill="currentColor" />
                        ) : i % 5 === 3 ? (
                            <Rocket className="text-[#0072CE]/40" size={14 + Math.random() * 14} />
                        ) : (
                            <Heart className="text-[#00A0DC]/40" size={14 + Math.random() * 14} fill="currentColor" />
                        )}
                    </motion.div>
                ))}

                {/* Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0072CE08_1px,transparent_1px),linear-gradient(to_bottom,#0072CE08_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            </div>

            {/* Back Button */}
            <motion.div 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                className="absolute left-8 top-8 z-20"
            >
                <motion.div
                    whileHover={{ scale: 1.1, x: -5 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Button 
                        variant={'outline'} 
                        onClick={() => navigate('/')} 
                        className="bg-white/90 backdrop-blur-xl border-2 border-[#0072CE]/20 hover:bg-white hover:border-[#0072CE]/40 shadow-xl hover:shadow-2xl transition-all duration-300" 
                        style={{ boxShadow: '0 10px 40px rgba(0, 114, 206, 0.3)' }}
                    >
                        <ArrowLeft className="text-[#0072CE]" />
                    </Button>
                </motion.div>
            </motion.div>

            {/* Main Content */}
            <div className="min-h-screen flex items-center justify-center px-4 relative z-10 py-12">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.6 }} 
                    className="w-full max-w-6xl mx-auto"
                >
                    <div 
                        className="bg-white/95 backdrop-blur-2xl rounded-[3rem] overflow-hidden relative border-2 border-white/50" 
                        style={{ 
                            boxShadow: '0 30px 60px rgba(0, 114, 206, 0.3), inset 0 1px 0 rgba(255,255,255,0.5)',
                            transformStyle: 'preserve-3d'
                        }}
                    >
                        {/* Animated gradient overlay */}
                        <motion.div
                            animate={{
                                background: [
                                    'linear-gradient(135deg, rgba(0, 114, 206, 0.05), transparent)',
                                    'linear-gradient(225deg, rgba(0, 160, 220, 0.05), transparent)',
                                    'linear-gradient(315deg, rgba(0, 114, 206, 0.05), transparent)',
                                    'linear-gradient(45deg, rgba(0, 160, 220, 0.05), transparent)',
                                ]
                            }}
                            transition={{ duration: 5, repeat: Infinity }}
                            className="absolute inset-0 pointer-events-none"
                        />
                        
                        <div className="grid md:grid-cols-2 gap-0 relative">
                            {/* Left Side - Form */}
                            <div className="p-8 md:p-12 lg:p-16 relative">
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }} 
                                    animate={{ opacity: 1, y: 0 }} 
                                    transition={{ delay: 0.2 }}
                                >
                                    {/* Badge */}
                                    <motion.div 
                                        className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#0072CE] to-[#00A0DC] rounded-2xl mb-6 relative overflow-hidden" 
                                        style={{ 
                                            boxShadow: '0 15px 40px rgba(0, 114, 206, 0.5), inset 0 2px 0 rgba(255,255,255,0.3)',
                                            transformStyle: 'preserve-3d'
                                        }} 
                                        whileHover={{ scale: 1.05, y: -3 }} 
                                        transition={{ type: "spring", stiffness: 400 }}
                                    >
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                        >
                                            <Globe className="text-white drop-shadow-lg" size={24} />
                                        </motion.div>
                                        <span className="text-white font-black text-base drop-shadow-lg">DNTU Buddies</span>
                                        
                                        {/* Shine effect */}
                                        <motion.div
                                            animate={{ x: ['-100%', '200%'] }}
                                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                                        />
                                    </motion.div>
                                    
                                    {/* Title */}
                                    <motion.h1 
                                        className="text-6xl font-black mb-3"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <span className="bg-gradient-to-r from-[#003F87] via-[#0072CE] to-[#00A0DC] bg-clip-text text-transparent">
                                            Đăng nhập
                                        </span>
                                    </motion.h1>
                                    <p className="text-gray-600 mb-8 text-lg font-medium">
                                        Dành cho thành viên DNTU Buddies Team
                                    </p>
                                </motion.div>
                                
                                {/* Form */}
                                <motion.form 
                                    initial={{ opacity: 0 }} 
                                    animate={{ opacity: 1 }} 
                                    transition={{ delay: 0.4 }} 
                                    className="space-y-6" 
                                    onSubmit={formik.handleSubmit}
                                >
                                    {/* Email Field */}
                                    <motion.div 
                                        className="space-y-2"
                                        whileHover={{ scale: 1.01 }}
                                    >
                                        <Label htmlFor="username" className="text-gray-700 font-bold text-sm">
                                            Email
                                        </Label>
                                        <Input 
                                            type="email" 
                                            id="username" 
                                            placeholder="Nhập email của bạn" 
                                            className="h-16 bg-white border-2 border-gray-200 focus:border-[#0072CE] focus:ring-4 focus:ring-[#0072CE]/20 rounded-2xl transition-all duration-300 text-base font-medium" 
                                            style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.08)' }} 
                                            onChange={formik.handleChange} 
                                            onBlur={formik.handleBlur} 
                                            value={formik.values.username} 
                                        />
                                        {formik.touched.username && formik.errors.username && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: -5 }} 
                                                animate={{ opacity: 1, y: 0 }} 
                                                className="text-red-500 text-sm font-bold flex items-center gap-2"
                                            >
                                                <Info size={16} />
                                                {formik.errors.username}
                                            </motion.div>
                                        )}
                                    </motion.div>

                                    {/* Password Field */}
                                    <motion.div 
                                        className="space-y-2"
                                        whileHover={{ scale: 1.01 }}
                                    >
                                        <Label htmlFor="password" className="text-gray-700 font-bold text-sm">
                                            Mật khẩu
                                        </Label>
                                        <Input 
                                            type="password" 
                                            id="password" 
                                            placeholder="Nhập mật khẩu" 
                                            className="h-16 bg-white border-2 border-gray-200 focus:border-[#0072CE] focus:ring-4 focus:ring-[#0072CE]/20 rounded-2xl transition-all duration-300 text-base font-medium" 
                                            style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.08)' }} 
                                            onChange={formik.handleChange} 
                                            onBlur={formik.handleBlur} 
                                            value={formik.values.password} 
                                        />
                                        {formik.touched.password && formik.errors.password && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: -5 }} 
                                                animate={{ opacity: 1, y: 0 }} 
                                                className="text-red-500 text-sm font-bold flex items-center gap-2"
                                            >
                                                <Info size={16} />
                                                {formik.errors.password}
                                            </motion.div>
                                        )}
                                    </motion.div>

                                    {/* Error Message */}
                                    {errorMessage && (
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.9 }} 
                                            animate={{ opacity: 1, scale: 1 }} 
                                            className="flex items-center gap-3 text-red-600 text-sm bg-red-50 p-5 rounded-2xl border-2 border-red-200" 
                                            style={{ boxShadow: '0 6px 20px rgba(239, 68, 68, 0.15)' }}
                                        >
                                            <Info size={20} />
                                            <span className="font-bold">{errorMessage}</span>
                                        </motion.div>
                                    )}

                                    {/* Submit Button */}
                                    <motion.div 
                                        whileHover={{ scale: 1.02, y: -2 }} 
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Button 
                                            type="submit" 
                                            disabled={loading} 
                                            className="w-full h-16 bg-gradient-to-r from-[#0072CE] via-[#00A0DC] to-[#0072CE] hover:from-[#005BA8] hover:via-[#0088BB] hover:to-[#005BA8] text-white font-black text-lg rounded-2xl transition-all duration-300 relative overflow-hidden" 
                                            style={{ 
                                                boxShadow: '0 15px 40px rgba(0, 114, 206, 0.5), inset 0 2px 0 rgba(255,255,255,0.2)',
                                                backgroundSize: '200% 100%'
                                            }}
                                        >
                                            <motion.div
                                                animate={{ x: ['-100%', '200%'] }}
                                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                                            />
                                            {loading && <LoadingIcon />}
                                            <span className="relative z-10 drop-shadow-lg">
                                                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                                            </span>
                                        </Button>
                                    </motion.div>
                                </motion.form>
                            </div>

                            {/* Right Side - Visual */}
                            <div className="relative bg-gradient-to-br from-[#0072CE] via-[#00A0DC] to-[#0072CE] p-8 md:p-12 lg:p-16 flex items-center justify-center overflow-hidden">
                                {/* Animated Background */}
                                <div className="absolute inset-0">
                                    <motion.div 
                                        animate={{ 
                                            rotate: [0, 360], 
                                            scale: [1, 1.2, 1] 
                                        }} 
                                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }} 
                                        className="absolute top-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" 
                                    />
                                    <motion.div 
                                        animate={{ 
                                            rotate: [360, 0], 
                                            scale: [1, 1.3, 1] 
                                        }} 
                                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }} 
                                        className="absolute bottom-20 left-10 w-48 h-48 bg-[#00A0DC]/20 rounded-full blur-3xl" 
                                    />
                                    
                                    {/* Floating icons */}
                                    {[...Array(10)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            animate={{
                                                y: [0, -30, 0],
                                                x: [0, Math.random() * 40 - 20, 0],
                                                rotate: [0, 360],
                                                opacity: [0.2, 0.5, 0.2]
                                            }}
                                            transition={{
                                                duration: 5 + Math.random() * 3,
                                                repeat: Infinity,
                                                delay: Math.random() * 3
                                            }}
                                            className="absolute"
                                            style={{
                                                left: `${Math.random() * 100}%`,
                                                top: `${Math.random() * 100}%`,
                                            }}
                                        >
                                            {i % 3 === 0 ? (
                                                <Star className="text-white/30" size={16} fill="currentColor" />
                                            ) : i % 3 === 1 ? (
                                                <Sparkles className="text-white/30" size={16} />
                                            ) : (
                                                <Heart className="text-white/30" size={16} fill="currentColor" />
                                            )}
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Main Visual */}
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.8 }} 
                                    animate={{ opacity: 1, scale: 1 }} 
                                    transition={{ delay: 0.5 }} 
                                    className="relative z-10 text-center"
                                >
                                    {/* Globe Image */}
                                    <motion.div 
                                        className="relative w-72 h-72 mx-auto mb-12" 
                                        animate={{ y: [0, -20, 0] }} 
                                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                    >
                                        {/* Glow */}
                                        <motion.div 
                                            className="absolute inset-0 bg-white/40 rounded-full blur-3xl"
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 3, repeat: Infinity }}
                                        />
                                        
                                        {/* Main Circle */}
                                        <div 
                                            className="relative w-full h-full rounded-full overflow-hidden" 
                                            style={{ 
                                                boxShadow: '0 30px 60px rgba(0,0,0,0.4), inset 0 15px 40px rgba(255,255,255,0.3)',
                                                border: '6px solid rgba(255,255,255,0.4)'
                                            }}
                                        >
                                            <img 
                                                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80" 
                                                alt="Global Connection" 
                                                className="w-full h-full object-cover" 
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-br from-[#0072CE]/40 to-[#00A0DC]/40 mix-blend-overlay"></div>
                                        </div>
                                        
                                        {/* Orbiting Icons */}
                                        <motion.div 
                                            animate={{ rotate: 360 }} 
                                            transition={{ duration: 25, repeat: Infinity, ease: "linear" }} 
                                            className="absolute inset-0"
                                        >
                                            <motion.div 
                                                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white rounded-2xl flex items-center justify-center" 
                                                style={{ boxShadow: '0 10px 30px rgba(0, 114, 206, 0.5)' }}
                                                whileHover={{ scale: 1.2 }}
                                            >
                                                <Users className="text-[#0072CE]" size={28} />
                                            </motion.div>
                                        </motion.div>
                                        
                                        <motion.div 
                                            animate={{ rotate: -360 }} 
                                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }} 
                                            className="absolute inset-0"
                                        >
                                            <motion.div 
                                                className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-14 h-14 bg-white rounded-2xl flex items-center justify-center" 
                                                style={{ boxShadow: '0 10px 30px rgba(0, 160, 220, 0.5)' }}
                                                whileHover={{ scale: 1.2 }}
                                            >
                                                <Globe className="text-[#00A0DC]" size={28} />
                                            </motion.div>
                                        </motion.div>
                                        
                                        <motion.div 
                                            animate={{ rotate: 360 }} 
                                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }} 
                                            className="absolute inset-0"
                                        >
                                            <motion.div 
                                                className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white rounded-2xl flex items-center justify-center" 
                                                style={{ boxShadow: '0 10px 30px rgba(0, 63, 135, 0.5)' }}
                                                whileHover={{ scale: 1.2 }}
                                            >
                                                <Trophy className="text-[#003F87]" size={28} />
                                            </motion.div>
                                        </motion.div>
                                    </motion.div>

                                    {/* Floating Stats */}
                                    <div className="relative h-28 mb-10">
                                        <motion.div 
                                            animate={{ 
                                                y: [0, -15, 0], 
                                                rotate: [-5, 5, -5] 
                                            }} 
                                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} 
                                            className="absolute left-0 top-0 bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-2xl" 
                                            style={{ boxShadow: '0 25px 50px rgba(0,0,0,0.3)' }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <motion.div 
                                                    className="w-12 h-12 bg-gradient-to-br from-[#0072CE] to-[#00A0DC] rounded-xl flex items-center justify-center"
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                                >
                                                    <Users className="text-white" size={24} />
                                                </motion.div>
                                                <div className="text-left">
                                                    <div className="text-xs text-gray-500 font-bold">Thành Viên</div>
                                                    <div className="text-xl font-black text-[#003F87]">Nhiều lắm</div>
                                                </div>
                                            </div>
                                        </motion.div>
                                        
                                        <motion.div 
                                            animate={{ 
                                                y: [0, 15, 0], 
                                                rotate: [5, -5, 5] 
                                            }} 
                                            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} 
                                            className="absolute right-0 top-0 bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-2xl" 
                                            style={{ boxShadow: '0 25px 50px rgba(0,0,0,0.3)' }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <motion.div 
                                                    className="w-12 h-12 bg-gradient-to-br from-[#00A0DC] to-[#0072CE] rounded-xl flex items-center justify-center"
                                                    animate={{ rotate: -360 }}
                                                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                                                >
                                                    <Globe className="text-white" size={24} />
                                                </motion.div>
                                                <div className="text-left">
                                                    <div className="text-xs text-gray-500 font-bold">Quốc gia</div>
                                                    <div className="text-xl font-black text-[#003F87]">Nhiều lắm</div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* Title */}
                                    <motion.div 
                                        initial={{ opacity: 0, y: 20 }} 
                                        animate={{ opacity: 1, y: 0 }} 
                                        transition={{ delay: 0.7 }} 
                                        className="mt-8"
                                    >
                                        <h2 className="text-5xl font-black text-white mb-4 drop-shadow-2xl">
                                            🌎 DNTU Buddies Team
                                        </h2>
                                        <p className="text-white/95 text-2xl font-bold drop-shadow-lg">
                                            Kết nối toàn cầu, lan tỏa giá trị
                                        </p>
                                    </motion.div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
