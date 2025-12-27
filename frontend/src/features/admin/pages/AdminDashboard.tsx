import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { memberService } from '../../../services/memberService'
import { Member, MemberStats } from '../../../types/member'
import { Plus, Edit, Trash2, Users, UserCheck, UserX } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function AdminDashboard() {
    const [members, setMembers] = useState<Member[]>([])
    const [stats, setStats] = useState<MemberStats | null>(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            setLoading(true)
            const [membersData, statsData] = await Promise.all([
                memberService.getAllMembers({ limit: 100 }),
                memberService.getMemberStats(),
            ])
            setMembers(membersData.members)
            setStats(statsData)
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xóa thành viên này?')) return

        try {
            await memberService.deleteMember(id)
            fetchData()
        } catch (error) {
            console.error('Error deleting member:', error)
            alert('Có lỗi xảy ra khi xóa thành viên')
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
                    <button
                        onClick={() => navigate('/admin/members/create')}
                        className="flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-colors"
                    >
                        <Plus size={20} />
                        Thêm Thành Viên
                    </button>
                </div>

                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <StatCard icon={<Users />} title="Tổng Thành Viên" value={stats.total} color="blue" />
                        <StatCard icon={<UserCheck />} title="Đang Hoạt Động" value={stats.active} color="green" />
                        <StatCard icon={<UserX />} title="Không Hoạt Động" value={stats.inactive} color="red" />
                    </div>
                )}

                {/* Members Table */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white/5">
                                <tr>
                                    <th className="px-6 py-4 text-left text-white font-semibold">Avatar</th>
                                    <th className="px-6 py-4 text-left text-white font-semibold">Tên</th>
                                    <th className="px-6 py-4 text-left text-white font-semibold">Vai Trò</th>
                                    <th className="px-6 py-4 text-left text-white font-semibold">MSSV</th>
                                    <th className="px-6 py-4 text-left text-white font-semibold">Trạng Thái</th>
                                    <th className="px-6 py-4 text-left text-white font-semibold">Thao Tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                                            Đang tải...
                                        </td>
                                    </tr>
                                ) : (
                                    members.map((member) => (
                                        <tr key={member._id} className="border-t border-white/10 hover:bg-white/5">
                                            <td className="px-6 py-4">
                                                <img
                                                    src={member.avatar}
                                                    alt={member.fullName}
                                                    className="w-12 h-12 rounded-full object-cover"
                                                />
                                            </td>
                                            <td className="px-6 py-4 text-white">{member.fullName}</td>
                                            <td className="px-6 py-4 text-gray-300">{member.role}</td>
                                            <td className="px-6 py-4 text-gray-300">{member.studentId || '-'}</td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs ${
                                                        member.isActive
                                                            ? 'bg-green-500/20 text-green-300'
                                                            : 'bg-red-500/20 text-red-300'
                                                    }`}
                                                >
                                                    {member.isActive ? 'Hoạt động' : 'Không hoạt động'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => navigate(`/admin/members/edit/${member._id}`)}
                                                        className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(member._id)}
                                                        className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

interface StatCardProps {
    icon: React.ReactNode
    title: string
    value: number
    color: 'blue' | 'green' | 'red'
}

function StatCard({ icon, title, value, color }: StatCardProps) {
    const colorClasses = {
        blue: 'text-blue-400 bg-blue-500/20',
        green: 'text-green-400 bg-green-500/20',
        red: 'text-red-400 bg-red-500/20',
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
            <div className={`w-12 h-12 ${colorClasses[color]} rounded-xl flex items-center justify-center mb-4`}>
                {icon}
            </div>
            <h3 className="text-gray-300 text-sm mb-1">{title}</h3>
            <p className="text-3xl font-bold text-white">{value}</p>
        </motion.div>
    )
}
