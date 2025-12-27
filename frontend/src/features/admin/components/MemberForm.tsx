import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { memberService } from '../../../services/memberService'
import { ArrowLeft, Upload, Plus, X } from 'lucide-react'

interface MemberFormProps {
    memberId?: string
}

export default function MemberForm({ memberId }: MemberFormProps) {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [imagePreview, setImagePreview] = useState<string>('')
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        studentId: '',
        role: '',
        bio: '',
        description: '',
        major: '',
        year: '',
        skills: [] as string[],
        interests: [] as string[],
        socialLinks: {
            facebook: '',
            github: '',
            linkedin: '',
            instagram: '',
            email: '',
        },
        isActive: true,
        displayOrder: 0,
    })
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [skillInput, setSkillInput] = useState('')

    useEffect(() => {
        if (memberId) {
            fetchMember()
        }
    }, [memberId])

    const fetchMember = async () => {
        try {
            const data = await memberService.getMemberById(memberId!)
            setFormData({
                fullName: data.fullName,
                email: data.email || '',
                password: '', // Không hiển thị password cũ
                studentId: data.studentId || '',
                role: data.role,
                bio: data.bio || '',
                description: data.description || '',
                major: data.major || '',
                year: data.year || '',
                skills: data.skills || [],
                interests: data.interests || [],
                socialLinks: {
                    facebook: data.socialLinks?.facebook || '',
                    github: data.socialLinks?.github || '',
                    linkedin: data.socialLinks?.linkedin || '',
                    instagram: data.socialLinks?.instagram || '',
                    email: data.socialLinks?.email || '',
                },
                isActive: data.isActive,
                displayOrder: data.displayOrder,
            })
            setImagePreview(data.avatar)
        } catch (error) {
            console.error('Error fetching member:', error)
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const file = e.target.files?.[0]
        if (file) {
            setAvatarFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const addSkill = (): void => {
        if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
            setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] })
            setSkillInput('')
        }
    }

    const removeSkill = (skill: string): void => {
        setFormData({ ...formData, skills: formData.skills.filter((s: string) => s !== skill) })
    }

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault()
        setLoading(true)

        try {
            const submitData = new FormData()
            
            // Append all form fields
            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'password' && !value) {
                    // Skip password if empty (for update)
                    return
                }
                if (key === 'socialLinks') {
                    submitData.append(key, JSON.stringify(value))
                } else if (Array.isArray(value)) {
                    submitData.append(key, JSON.stringify(value))
                } else {
                    submitData.append(key, String(value))
                }
            })

            // Append avatar if exists
            if (avatarFile) {
                submitData.append('avatar', avatarFile)
            }

            if (memberId) {
                await memberService.updateMember(memberId, submitData)
                alert('Cập nhật thành viên thành công!')
            } else {
                await memberService.createMember(submitData)
                alert('Tạo thành viên mới thành công!')
            }

            navigate('/admin')
        } catch (error) {
            console.error('Error submitting form:', error)
            alert('Có lỗi xảy ra!')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate('/admin')}
                    className="flex items-center gap-2 text-white hover:text-purple-400 transition-colors mb-6"
                >
                    <ArrowLeft size={20} />
                    Quay lại
                </button>

                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                    <h1 className="text-3xl font-bold text-white mb-6">
                        {memberId ? 'Chỉnh sửa thành viên' : 'Thêm thành viên mới'}
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Avatar Upload */}
                        <div>
                            <label className="block text-white mb-2">Avatar</label>
                            <div className="flex items-center gap-4">
                                {imagePreview && (
                                    <img src={imagePreview} alt="Preview" className="w-24 h-24 rounded-full object-cover" />
                                )}
                                <label className="cursor-pointer px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors flex items-center gap-2">
                                    <Upload size={20} />
                                    Chọn ảnh
                                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                </label>
                            </div>
                        </div>

                        {/* Basic Info */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white mb-2">Họ tên *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.fullName}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-white mb-2">Email *</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                        </div>

                        {!memberId && (
                            <div>
                                <label className="block text-white mb-2">Mật khẩu * (tối thiểu 6 ký tự)</label>
                                <input
                                    type="password"
                                    required={!memberId}
                                    minLength={6}
                                    value={formData.password}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Nhập mật khẩu cho thành viên"
                                />
                            </div>
                        )}

                        {memberId && (
                            <div>
                                <label className="block text-white mb-2">Mật khẩu mới (để trống nếu không đổi)</label>
                                <input
                                    type="password"
                                    minLength={6}
                                    value={formData.password}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Nhập mật khẩu mới nếu muốn đổi"
                                />
                            </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white mb-2">MSSV</label>
                                <input
                                    type="text"
                                    value={formData.studentId}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, studentId: e.target.value })}
                                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white mb-2">Vai trò *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.role}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-white mb-2">Chuyên ngành</label>
                                <input
                                    type="text"
                                    value={formData.major}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, major: e.target.value })}
                                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                        </div>

                        {/* Bio & Description */}
                        <div>
                            <label className="block text-white mb-2">Bio (ngắn gọn)</label>
                            <input
                                type="text"
                                value={formData.bio}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, bio: e.target.value })}
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        <div>
                            <label className="block text-white mb-2">Mô tả chi tiết</label>
                            <textarea
                                rows={4}
                                value={formData.description}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        {/* Skills */}
                        <div>
                            <label className="block text-white mb-2">Kỹ năng</label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={skillInput}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSkillInput(e.target.value)}
                                    onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                    className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Nhập kỹ năng..."
                                />
                                <button
                                    type="button"
                                    onClick={addSkill}
                                    className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.skills.map((skill: string) => (
                                    <span
                                        key={skill}
                                        className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm flex items-center gap-2"
                                    >
                                        {skill}
                                        <button type="button" onClick={() => removeSkill(skill)}>
                                            <X size={14} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white mb-2">Facebook</label>
                                <input
                                    type="url"
                                    value={formData.socialLinks.facebook}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        setFormData({
                                            ...formData,
                                            socialLinks: { ...formData.socialLinks, facebook: e.target.value },
                                        })
                                    }
                                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-white mb-2">GitHub</label>
                                <input
                                    type="url"
                                    value={formData.socialLinks.github}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        setFormData({
                                            ...formData,
                                            socialLinks: { ...formData.socialLinks, github: e.target.value },
                                        })
                                    }
                                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                        </div>

                        {/* Status */}
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={formData.isActive}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, isActive: e.target.checked })}
                                className="w-5 h-5"
                            />
                            <label htmlFor="isActive" className="text-white">
                                Đang hoạt động
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-6 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-500 text-white rounded-lg transition-colors font-semibold"
                        >
                            {loading ? 'Đang xử lý...' : memberId ? 'Cập nhật' : 'Tạo mới'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
