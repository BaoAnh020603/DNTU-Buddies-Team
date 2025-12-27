import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ImageUpload from '@/components/ImageUpload'
import profileService from '@/services/profileService'
import { type User } from '@/types/user'
import { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'sonner'
import { Activity, CirclePlus, Eye, Loader2, Superscript, Trophy, UserIcon, Trash2, Save } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// Validation Schema
const profileValidationSchema = Yup.object({
    displayName: Yup.string().required('Tên hiển thị là bắt buộc').min(2, 'Tên phải có ít nhất 2 ký tự'),
    email: Yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
    position: Yup.string().required('Vị trí là bắt buộc'),
    quote: Yup.string().max(200, 'Quote không được vượt quá 200 ký tự'),
    desc: Yup.string().max(500, 'Mô tả không được vượt quá 500 ký tự'),
    aboutMe: Yup.string().max(1000, 'Giới thiệu không được vượt quá 1000 ký tự'),
    avatar: Yup.string(),
    classData: Yup.object({
        numberOfClassesTaught: Yup.string(),
        totalStudents: Yup.string(),
        expTeachingYears: Yup.string(),
    }),
    socialLinks: Yup.object({
        linkedin: Yup.string().url('URL LinkedIn không hợp lệ'),
        github: Yup.string().url('URL GitHub không hợp lệ'),
        facebook: Yup.string().url('URL Facebook không hợp lệ'),
    }),
    // project: Yup.array().of(
    //     Yup.object({
    //         title: Yup.string().required('Tên dự án là bắt buộc'),
    //         desc: Yup.string(),
    //         imageUrl: Yup.string(),
    //         link: Yup.string().url('Link dự án không hợp lệ'),
    //     })
    // ),
    achievements: Yup.array().of(
        Yup.object({
            event: Yup.string().required('Tiêu đề thành tựu là bắt buộc'),
            desc: Yup.string(),
            year: Yup.string(),
        })
    ),
})

export default function ProfilePage() {
    const [profile, setProfile] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [uploadFiles, setUploadFiles] = useState<{
        avatar?: File
        projects: { [key: number]: File }
    }>({ projects: {} })
    const navigate = useNavigate()
    const formik = useFormik({
        initialValues: {
            displayName: '',
            email: '',
            position: '',
            quote: '',
            desc: '',
            aboutMe: '',
            avatar: '',
            classData: {
                numberOfClassesTaught: '',
                totalStudents: '',
                expTeachingYears: '',
            },
            socialLinks: {
                linkedin: '',
                github: '',
                facebook: '',
            },
            project: [] as Array<{ title: string; desc: string; imageUrl: string; link: string }>,
            achievements: [] as Array<{ year: string; event: string; desc: string }>,
        },
        validationSchema: profileValidationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                if (!profile?._id) {
                    toast.error('Không tìm thấy thông tin người dùng')
                    return
                }
                const updatedProfile = await profileService.updateProfile(profile._id, values as any, uploadFiles)
                setProfile(updatedProfile)
                toast.success('Cập nhật thông tin thành công!')
                // Reset upload files
                setUploadFiles({ projects: {} })
            } catch (error: any) {
                console.error('Update error:', error)
                toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin')
            } finally {
                setSubmitting(false)
            }
        },
    })

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setIsLoading(true)
                const res = await profileService.getProfile()
                setProfile(res)

                // Set initial values for formik
                formik.setValues({
                    displayName: res.displayName || '',
                    email: res.email || '',
                    position: res.position || '',
                    quote: res.quote || '',
                    desc: res.desc || '',
                    aboutMe: res.aboutMe || '',
                    avatar: res.avatar || '',
                    classData: {
                        numberOfClassesTaught: res.classData?.numberOfClassesTaught || '',
                        totalStudents: res.classData?.totalStudents || '',
                        expTeachingYears: res.classData?.expTeachingYears || '',
                    },
                    socialLinks: {
                        linkedin: res.socialLinks?.linkedin || '',
                        github: res.socialLinks?.github || '',
                        facebook: res.socialLinks?.facebook || '',
                    },
                    project: res.project || [],
                    achievements: res.achievements || [],
                })
            } catch (error) {
                console.error('Fetch profile error:', error)
                toast.error('Không thể tải thông tin người dùng')
            } finally {
                setIsLoading(false)
            }
        }
        fetchProfile()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-8 md:py-12">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Chỉnh sửa thông tin cá nhân</h1>
                <p className="text-muted-foreground">Cập nhật thông tin cá nhân và hồ sơ của bạn</p>
            </div>

            <form onSubmit={formik.handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Avatar Section */}
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle>Ảnh đại diện</CardTitle>
                            <CardDescription>Cập nhật ảnh đại diện của bạn</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center gap-4">
                            <ImageUpload
                                value={formik.values.avatar}
                                onChange={(value, file) => {
                                    formik.setFieldValue('avatar', value)
                                    if (file) {
                                        setUploadFiles((prev) => ({ ...prev, avatar: file }))
                                    }
                                }}
                                id="avatar"
                                placeholder="https://example.com/avatar.jpg"
                            />
                            {formik.touched.avatar && formik.errors.avatar && <p className="text-sm text-red-500">{formik.errors.avatar}</p>}
                        </CardContent>
                    </Card>

                    {/* Main Content */}
                    <Card className="lg:col-span-2">
                        <Tabs defaultValue="basic" className="w-full">
                            <CardHeader>
                                <TabsList className="grid w-full h-10 overflow-x-auto grid-cols-4">
                                    <TabsTrigger value="basic" className="">
                                        <UserIcon className="mr-2 h-4 w-4" /> Thông tin cơ bản
                                    </TabsTrigger>
                                    <TabsTrigger value="teaching" className="">
                                        <Superscript className="mr-2 h-4 w-4" /> Giảng dạy
                                    </TabsTrigger>
                                    {/* <TabsTrigger value="project" className="">
                                        <LayoutPanelTop className="mr-2 h-4 w-4" /> Dự án
                                    </TabsTrigger> */}
                                    <TabsTrigger value="achievements" className="">
                                        <Trophy className="mr-2 h-4 w-4" /> Thành tựu
                                    </TabsTrigger>
                                    <TabsTrigger value="social" className="">
                                        <Activity className="mr-2 h-4 w-4" /> Mạng xã hội
                                    </TabsTrigger>
                                </TabsList>
                            </CardHeader>

                            <CardContent className="mt-5">
                                {/* Basic Info Tab */}
                                <TabsContent value="basic" className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="displayName">Tên hiển thị</Label>
                                            <Input
                                                id="displayName"
                                                name="displayName"
                                                type="text"
                                                readOnly
                                                placeholder="Nguyễn Văn A"
                                                value={formik.values.displayName}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            />
                                            {formik.touched.displayName && formik.errors.displayName && <p className="text-sm text-red-500">{formik.errors.displayName}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                readOnly
                                                type="email"
                                                placeholder="email@example.com"
                                                value={formik.values.email}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            />
                                            {formik.touched.email && formik.errors.email && <p className="text-sm text-red-500">{formik.errors.email}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="position">
                                            Vị trí <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="position"
                                            name="position"
                                            type="text"
                                            placeholder="Giảng viên, Developer, ..."
                                            value={formik.values.position}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.position && formik.errors.position && <p className="text-sm text-red-500">{formik.errors.position}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="quote">Quote của bạn</Label>
                                        <Input
                                            id="quote"
                                            name="quote"
                                            type="text"
                                            placeholder="Câu nói yêu thích của bạn..."
                                            value={formik.values.quote}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.quote && formik.errors.quote && <p className="text-sm text-red-500">{formik.errors.quote}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="desc">Mô tả cảm nghĩ của bạn khi làm giáo viên</Label>
                                        <Textarea
                                            id="desc"
                                            name="desc"
                                            placeholder="Mô tả cảm nghĩ của bạn khi làm giáo viên..."
                                            rows={3}
                                            value={formik.values.desc}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.desc && formik.errors.desc && <p className="text-sm text-red-500">{formik.errors.desc}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="aboutMe">Giới thiệu về bản thân</Label>
                                        <Textarea
                                            id="aboutMe"
                                            name="aboutMe"
                                            placeholder="Giới thiệu chi tiết về bản thân, kinh nghiệm, sở thích..."
                                            rows={5}
                                            value={formik.values.aboutMe}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.aboutMe && formik.errors.aboutMe && <p className="text-sm text-red-500">{formik.errors.aboutMe}</p>}
                                    </div>
                                </TabsContent>

                                {/* Teaching Info Tab */}
                                <TabsContent value="teaching" className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="classData.numberOfClassesTaught">Số lớp đã giảng dạy</Label>
                                        <Input
                                            id="classData.numberOfClassesTaught"
                                            name="classData.numberOfClassesTaught"
                                            type="number"
                                            placeholder="10"
                                            value={formik.values.classData.numberOfClassesTaught}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="classData.totalStudents">Tổng số học sinh</Label>
                                        <Input
                                            id="classData.totalStudents"
                                            name="classData.totalStudents"
                                            type="number"
                                            placeholder="200"
                                            value={formik.values.classData.totalStudents}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="classData.expTeachingYears">Năm vào MindX</Label>
                                        <Input
                                            id="classData.expTeachingYears"
                                            name="classData.expTeachingYears"
                                            type="number"
                                            placeholder="2023"
                                            value={formik.values.classData.expTeachingYears}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                    </div>
                                </TabsContent>

                                {/* Social Links Tab */}
                                <TabsContent value="social" className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="socialLinks.linkedin">LinkedIn</Label>
                                        <Input
                                            id="socialLinks.linkedin"
                                            name="socialLinks.linkedin"
                                            type="text"
                                            placeholder="https://linkedin.com/in/username"
                                            value={formik.values.socialLinks.linkedin}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.socialLinks?.linkedin && formik.errors.socialLinks?.linkedin && <p className="text-sm text-red-500">{formik.errors.socialLinks.linkedin}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="socialLinks.github">GitHub</Label>
                                        <Input
                                            id="socialLinks.github"
                                            name="socialLinks.github"
                                            type="text"
                                            placeholder="https://github.com/username"
                                            value={formik.values.socialLinks.github}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.socialLinks?.github && formik.errors.socialLinks?.github && <p className="text-sm text-red-500">{formik.errors.socialLinks.github}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="socialLinks.facebook">Facebook</Label>
                                        <Input
                                            id="socialLinks.facebook"
                                            name="socialLinks.facebook"
                                            type="text"
                                            placeholder="https://facebook.com/username"
                                            value={formik.values.socialLinks.facebook}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.socialLinks?.facebook && formik.errors.socialLinks?.facebook && <p className="text-sm text-red-500">{formik.errors.socialLinks.facebook}</p>}
                                    </div>
                                </TabsContent>
                                {/* <TabsContent value="project" className="space-y-4">
                                    {formik.values.project.map((proj: any, index: number) => (
                                        <div key={index} className="border p-4 rounded-lg bg-popover/50 space-y-3 relative flex items-center gap-5">
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-2 right-2 h-8 w-8"
                                                onClick={() => {
                                                    const newProjects = formik.values.project.filter((_, i) => i !== index)
                                                    formik.setFieldValue('project', newProjects)
                                                    toast.success('Đã xóa dự án')
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                            <div className="flex-1 space-y-3">
                                                <div className="space-y-2">
                                                    <Label htmlFor={`project.${index}.title`}>
                                                        Tên dự án <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Input
                                                        id={`project.${index}.title`}
                                                        name={`project.${index}.title`}
                                                        type="text"
                                                        placeholder="Tên dự án"
                                                        value={proj.title || ''}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                    />
                                                    {formik.touched.project?.[index]?.title &&
                                                        formik.errors.project?.[index] &&
                                                        typeof formik.errors.project[index] === 'object' &&
                                                        (formik.errors.project[index] as any).title && <p className="text-sm text-red-500">{(formik.errors.project[index] as any).title}</p>}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor={`project.${index}.desc`}>Mô tả dự án</Label>
                                                    <Textarea
                                                        id={`project.${index}.desc`}
                                                        name={`project.${index}.desc`}
                                                        placeholder="Mô tả dự án"
                                                        rows={3}
                                                        value={proj.desc || ''}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <ImageUpload
                                                        label="Hình ảnh dự án"
                                                        value={proj.imageUrl || ''}
                                                        onChange={(value, file) => {
                                                            formik.setFieldValue(`project.${index}.imageUrl`, value)
                                                            if (file) {
                                                                setUploadFiles((prev) => ({
                                                                    ...prev,
                                                                    projects: { ...prev.projects, [index]: file },
                                                                }))
                                                            }
                                                        }}
                                                        id={`project.${index}.imageUrl`}
                                                        placeholder="https://example.com/project.png"
                                                    />
                                                    {formik.touched.project?.[index]?.imageUrl &&
                                                        formik.errors.project?.[index] &&
                                                        typeof formik.errors.project[index] === 'object' &&
                                                        (formik.errors.project[index] as any).imageUrl && <p className="text-sm text-red-500">{(formik.errors.project[index] as any).imageUrl}</p>}
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor={`project.${index}.link`}>Link dự án</Label>
                                                    <Input
                                                        id={`project.${index}.link`}
                                                        name={`project.${index}.link`}
                                                        type="text"
                                                        placeholder="https://example.com/project"
                                                        value={proj.link || ''}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                    />
                                                    {formik.touched.project?.[index]?.link &&
                                                        formik.errors.project?.[index] &&
                                                        typeof formik.errors.project[index] === 'object' &&
                                                        (formik.errors.project[index] as any).link && <p className="text-sm text-red-500">{(formik.errors.project[index] as any).link}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => {
                                            const newProject = { title: '', desc: '', imageUrl: '', link: '' }
                                            formik.setFieldValue('project', [...formik.values.project, newProject])
                                        }}
                                    >
                                        <CirclePlus className="mr-2 h-4 w-4" />
                                        Thêm dự án mới
                                    </Button>

                                    {formik.values.project.length === 0 && (
                                        <div className="flex items-center justify-center flex-col gap-3 py-8">
                                            <p className="text-gray-400">Chưa có dự án cá nhân nào</p>
                                        </div>
                                    )}
                                </TabsContent> */}

                                {/* Achievements Tab */}
                                <TabsContent value="achievements" className="space-y-4">
                                    {formik.values.achievements.map((achievement: any, index: number) => (
                                        <div key={index} className="border bg-popover/50 p-4 rounded-lg space-y-3 relative">
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-2 right-2 h-8 w-8"
                                                onClick={() => {
                                                    const newAchievements = formik.values.achievements.filter((_, i) => i !== index)
                                                    formik.setFieldValue('achievements', newAchievements)
                                                    toast.success('Đã xóa thành tựu')
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>

                                            <div className="space-y-2">
                                                <Label htmlFor={`achievements.${index}.event`}>
                                                    Tên thành tựu <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id={`achievements.${index}.event`}
                                                    name={`achievements.${index}.event`}
                                                    type="text"
                                                    placeholder="Tiêu đề thành tựu"
                                                    value={achievement.event || ''}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                />
                                                {formik.touched.achievements?.[index]?.event &&
                                                    formik.errors.achievements?.[index] &&
                                                    typeof formik.errors.achievements[index] === 'object' &&
                                                    (formik.errors.achievements[index] as any).event && <p className="text-sm text-red-500">{(formik.errors.achievements[index] as any).event}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor={`achievements.${index}.desc`}>Mô tả thành tựu</Label>
                                                <Textarea
                                                    id={`achievements.${index}.desc`}
                                                    name={`achievements.${index}.desc`}
                                                    placeholder="Mô tả chi tiết về thành tựu"
                                                    rows={3}
                                                    value={achievement.desc || ''}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor={`achievements.${index}.year`}>Năm đạt được</Label>
                                                <Input
                                                    id={`achievements.${index}.year`}
                                                    name={`achievements.${index}.year`}
                                                    type="text"
                                                    placeholder="VD: 11/2025"
                                                    value={achievement.year || ''}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                />
                                            </div>
                                        </div>
                                    ))}

                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => {
                                            const newAchievement = { event: '', desc: '', year: '' }
                                            formik.setFieldValue('achievements', [...formik.values.achievements, newAchievement])
                                        }}
                                    >
                                        <CirclePlus className="mr-2 h-4 w-4" />
                                        Thêm thành tựu mới
                                    </Button>

                                    {formik.values.achievements.length === 0 && (
                                        <div className="flex items-center justify-center flex-col gap-3 py-8">
                                            <p className="text-gray-400">Chưa có thành tựu nào</p>
                                        </div>
                                    )}
                                </TabsContent>
                            </CardContent>
                        </Tabs>
                    </Card>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 mt-6">
                    <Button type="button" variant="outline" onClick={() => navigate('/profile/' + profile?.username)}>
                        <Eye /> Xem profile
                    </Button>
                    <Button type="submit" disabled={formik.isSubmitting || !formik.isValid}>
                        {formik.isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Đang lưu...
                            </>
                        ) : (
                            <>
                                <Save /> Lưu thay đổi
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}
