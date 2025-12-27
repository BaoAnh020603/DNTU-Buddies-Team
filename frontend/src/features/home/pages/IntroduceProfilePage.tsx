import BlurText from '@/components/BlurText'
import TextType from '@/components/TextType'
import TiltedCard from '@/components/TiltedCard'
import { ChevronLeft, Facebook, Github, Linkedin, Mail } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import AnimatedBackground from '../components/AnimatedBackground'
import { useEffect, useState } from 'react'
import CountUp from '@/components/CountUp'
import { type User } from '@/types/user'
import profileService from '@/services/profileService'
import { Button } from '@/components/ui/button'
export default function IntroduceProfilePage() {
    const pathname = useLocation().pathname
    const slug = pathname.split('/profile/')[1]
    const [profile, setProfile] = useState<User | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true)
            const res = await profileService.getProfileByUsername(slug)
            setProfile(res)
            setLoading(false)
        }
        fetchProfile()
    }, [])

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <h1 className="text-5xl font-bold mb-6">
                    <TextType text={[`Đang tải thông tin giáo viên này...`]} typingSpeed={75} pauseDuration={1500} showCursor={true} cursorCharacter="|" />
                </h1>
            </div>
        )
    }
    if (!loading && profile === null) {
        return (
            <div className="h-screen">
                <div className="absolute -z-10 inset-0 h-full w-full bg-[linear-gradient(to_right,#73737320_1px,transparent_1px),linear-gradient(to_bottom,#73737320_1px,transparent_1px)] bg-[size:80px_80px] opacity-50" />
                <AnimatedBackground />
                <div className=" max-w-7xl mx-auto h-screen flex items-center justify-center flex-col gap-5 ">
                    <h1 className="text-5xl font-bold mb-6">
                        <TextType text={[`Không tìm thấy người dùng này :((`]} typingSpeed={75} pauseDuration={1500} showCursor={true} cursorCharacter="|" />
                    </h1>
                    <Button variant={'outline'} className="" onClick={() => window.history.back()}>
                        <ChevronLeft />
                        Quay lại
                    </Button>
                </div>
            </div>
        )
    }
    return (
        <div className="relative px-5 md:px-0">
            <div className="absolute -z-10 inset-0 h-full w-full bg-[linear-gradient(to_right,#73737320_1px,transparent_1px),linear-gradient(to_bottom,#73737320_1px,transparent_1px)] bg-[size:80px_80px] opacity-50" />
            <AnimatedBackground />
            <div className=" max-w-7xl mx-auto h-screen grid md:grid-cols-2 items-center gap-6 grid-cols-1">
                <div className="animate__animated animate__fadeInUp">
                    <div className="flex items-center gap-3 mb-6 bg-gray-800/20 border border-white/10  w-fit p-4 rounded-2xl">
                        <img src={profile?.avatar} className="w-10 h-10 rounded-full object-cover object-[0%_15%]" />
                        <q className="flex-1">{profile?.quote || 'Chưa có quote'}</q>
                    </div>
                    <h1 className="text-5xl font-bold mb-6">
                        <TextType text={[`Hi I'm ${profile?.displayName}`]} typingSpeed={75} pauseDuration={1500} showCursor={true} cursorCharacter="|" />
                    </h1>
                    <BlurText text={profile?.desc || ''} delay={150} animateBy="words" direction="top" className=" mb-6" />
                    <a
                        href={`mailto:${profile?.email || ''}`}
                        className="border h-16 bg-gray-800/10 backdrop-blur-xs border-white/10 shadow px-5 rounded-full flex items-center justify-center gap-2 transition-all duration-500 hover:scale-105 cursor-pointer relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent  -translate-x-full group-hover:translate-x-full transition-all duration-500"></div>
                        <Mail /> Liên hệ qua email: {profile?.email}
                    </a>
                    <div className="flex items-center justify-center gap-5 mt-4">
                        <a
                            href={`${profile?.socialLinks.facebook || ''}`}
                            target="_blank"
                            className="border h-14 w-14 bg-blue-800/10 backdrop-blur-xs border-white/10 shadow  rounded-full flex items-center justify-center  transition-all duration-500 hover:scale-105 cursor-pointer relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 border border-x-blue-400 border-y-blue-700 rounded-full animate-spin animation-duration-3000"></div>
                            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent  -translate-x-full group-hover:translate-x-full transition-all duration-500"></div>
                            <Facebook size={22} />
                        </a>
                        <a
                            href={`${profile?.socialLinks.github || ''}`}
                            target="_blank"
                            className="border h-14 w-14 bg-gray-800/10 backdrop-blur-xs border-white/10 shadow  rounded-full flex items-center justify-center  transition-all duration-500 hover:scale-105 cursor-pointer relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 border border-x-gray-400 border-y-gray-700 rounded-full animate-spin animation-duration-3000"></div>
                            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent  -translate-x-full group-hover:translate-x-full transition-all duration-500"></div>
                            <Github size={22} />
                        </a>
                        <a
                            href={`${profile?.socialLinks.linkedin || ''}`}
                            target="_blank"
                            className="border h-14 w-14 bg-sky-800/10 backdrop-blur-xs border-white/10 shadow  rounded-full flex items-center justify-center  transition-all duration-500 hover:scale-105 cursor-pointer relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 border border-x-sky-400 border-y-sky-700 rounded-full animate-spin animation-duration-3000"></div>
                            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent  -translate-x-full group-hover:translate-x-full transition-all duration-500"></div>
                            <Linkedin size={22} />
                        </a>
                    </div>
                </div>
                <div className="hidden md:block md:ml-auto animate__animated animate__fadeInUp animate__delay-1s">
                    <TiltedCard rotateAmplitude={12} scaleOnHover={1.2} showMobileWarning={false} showTooltip={true} displayOverlayContent={true}>
                        <div className="bg-gray-800/20 backdrop-blur-xs rounded-4xl flex flex-col items-center w-[400px] overflow-hidden ring-2 ring-white/20 shadow-lg relative group">
                            <div className="absolute inset-0 bg-linear-to-br from-transparent via-white/10 to-transparent  -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>
                            <div className="py-10 text-center">
                                <h1 className="text-3xl font-bold mb-1">{profile?.displayName}</h1>
                                <p>{profile?.position}</p>
                            </div>
                            <img src={profile?.avatar} alt={profile?.displayName || ''} className="w-full h-[400px] object-cover rounded-t-4xl brightness-90 object-[0%_25%]" />
                            <div className="absolute w-[90%] h-16 bg-popover/50 backdrop-blur-md bottom-2 rounded-2xl flex items-center px-3 gap-2 shadow-sm">
                                <img src={profile?.avatar} alt={profile?.displayName || ''} className="w-10 h-10 rounded-full object-cover object-[0%_15%]" />
                                <div className="flex-1 flex items-center justify-between">
                                    <div className="">
                                        <h1>@{profile?.email?.split('@')[0] || ''}</h1>
                                        <p className="text-sm flex items-center gap-1">
                                            <div className="w-2 h-2 bg-green-600 rounded-full -translate-y-px"></div> Online
                                        </p>
                                    </div>
                                    <a href={`mailto:${profile?.email || ''}`} className="border border-white/60 h-10 flex items-center px-4 rounded-lg text-white text-sm bg-gray-700/20">
                                        Contact me
                                    </a>
                                </div>
                            </div>
                        </div>
                    </TiltedCard>
                </div>
            </div>

            <div className=" max-w-7xl mx-auto ">
                <div className="min-h-screen flex items-center justify-center ">
                    <div className="text-center space-y-10">
                        <h1 className="text-4xl font-bold mb-2 " data-aos="fade-up" data-aos-delay="200">
                            Về tôi
                        </h1>
                        <p data-aos="fade-up" data-aos-delay="300" className="mx-auto w-full md:w-[70%] text-xl">
                            {profile?.aboutMe || 'Chưa có thông tin về tôi.'}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 flex-1 w-full">
                            <div
                                className="w-full h-32 border bg-gray-900/20 backdrop-blur-xs border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3  p-6"
                                data-aos="fade-right"
                                data-aos-delay="200"
                            >
                                <h1 className="text-xl font-medium">Số năm giảng dạy</h1>
                                <CountUp
                                    from={0}
                                    to={profile?.classData?.expTeachingYears ? new Date().getFullYear() - Number(profile.classData.expTeachingYears) + 1 : 3}
                                    separator=","
                                    direction="up"
                                    duration={1}
                                    className="count-up-text text-3xl font-extrabold"
                                />
                            </div>
                            <div
                                className="w-full h-32 border bg-gray-900/20 backdrop-blur-xs border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3  p-6"
                                data-aos="fade-up"
                                data-aos-delay="300"
                            >
                                <h1 className="text-xl font-medium">Số lớp đã dạy</h1>
                                <CountUp
                                    from={0}
                                    to={Number(profile?.classData?.numberOfClassesTaught) || 12}
                                    separator=","
                                    direction="up"
                                    duration={1}
                                    className="count-up-text text-3xl  font-extrabold"
                                />
                            </div>
                            <div
                                className="w-full h-32 border bg-gray-900/20 backdrop-blur-xs border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3  p-6"
                                data-aos="fade-left"
                                data-aos-delay="400"
                            >
                                <h1 className="text-xl font-medium">Tổng số học viên đã dạy</h1>
                                <CountUp from={0} to={Number(profile?.classData?.totalStudents) || 89} separator="," direction="up" duration={1} className="count-up-text text-3xl font-extrabold" />
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className="min-h-screen flex items-center justify-center ">
                    <div className="">
                        <h1 className="text-4xl font-bold mb-12 text-center" data-aos="fade-up">
                            Dự án cá nhân
                        </h1>
                        <div
                            className={`grid grid-cols-1 ${
                                profile?.project && profile?.project?.length > 2 ? 'md:grid-cols-3' : profile?.project && profile?.project?.length > 1 ? 'md:grid-cols-2' : 'grid-cols-1'
                            } gap-5 mt-5  mb-5`}
                        >
                            {profile?.project?.map((proj, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-950/20 backdrop-blur-xs rounded-2xl border border-white/10 hover:border-white/30 transition-all  w-full overflow-hidden"
                                    data-aos={index % 2 === 0 ? 'fade-right' : 'fade-left'}
                                    data-aos-delay={index * 200}
                                >
                                    <img src={proj.imageUrl === '' ? 'https://placehold.co/400/262624/FFFFFF?text=No+Image' : proj.imageUrl} alt={proj.title} className="h-64 w-full object-cover" />
                                    <div className="p-6 space-y-3">
                                        <h3 className="text-2xl font-bold mb-2">{proj.title}</h3>
                                        <p className="mb-4 text-sm line-clamp-3">{proj.desc}</p>
                                        <a
                                            href={proj.link === '' ? '#' : proj.link}
                                            target="_blank"
                                            className={`${proj.link === '' ? 'cursor-not-allowed text-gray-500' : 'text-white hover:text-primary'} font-medium flex items-center`}
                                        >
                                            {proj.link === '' ? 'Không có trang web' : 'Xem trang web'} <ArrowRight size={16} className="inline-block ml-1" />
                                        </a>
                                    </div>
                                </div>
                            ))}
                            {profile?.project?.length === 0 && <div className="text-center col-span-full">Chưa có dự án cá nhân nào được cập nhật.</div>}
                        </div>
                    </div>
                </div> */}
                <div className="min-h-screen flex items-center justify-center ">
                    <div className="w-full">
                        <h1 className="text-4xl font-bold mb-12 text-center" data-aos="fade-up">
                            Thành tựu
                        </h1>
                        <div className="relative w-full flex-1">
                            {profile?.achievements && profile?.achievements?.length > 0 && (
                                <div className={`absolute md:left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-linear-to-b from-blue-500 via-purple-500 to-pink-500`}></div>
                            )}

                            {profile?.achievements?.map((item, index) => (
                                <div
                                    key={index}
                                    className={`flex w-full items-center  flex-row  mb-12 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                                    data-aos={index % 2 === 0 ? 'fade-right' : 'fade-left'}
                                    data-aos-delay={index * 100}
                                >
                                    <div className=" md:hidden w-4 h-4 bg-blue-500 rounded-full border-4 border-background relative z-10 -translate-x-2"></div>
                                    <div className={`flex-1 w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left'}`}>
                                        <div className="bg-gray-950/20 backdrop-blur-xs p-6 rounded-2xl border border-white/10 hover:border-white/30 transition-all w-full">
                                            <h3 className="text-xl font-bold mb-2">{item.event}</h3>
                                            {item.desc && <p className="text-gray-400">{item.desc}</p>}
                                            <p className="text-sm text-gray-400 mb-3">{item.year}</p>
                                        </div>
                                    </div>
                                    <div className="hidden md:block w-4 h-4 bg-blue-500 rounded-full border-4 border-background relative z-10 translate-x-2"></div>
                                    <div className="md:w-1/2"></div>
                                </div>
                            ))}
                            {profile?.achievements?.length === 0 && <div>Chưa có thành tựu nào được cập nhật.</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
