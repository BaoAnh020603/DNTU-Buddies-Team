import { motion } from 'framer-motion'
import { Member } from '../../../types/member'
import { Github, Linkedin, Facebook, Instagram, Mail } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface MemberCardProps {
    member: Member
    index: number
}

export default function MemberCard({ member, index }: MemberCardProps) {
    const navigate = useNavigate()

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -10 }}
            onClick={() => navigate(`/members/${member._id}`)}
            className="group relative bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20 hover:border-purple-500/50 transition-all duration-300 cursor-pointer"
        >
            {/* Avatar */}
            <div className="relative h-64 overflow-hidden">
                <img
                    src={member.avatar}
                    alt={member.fullName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-2">{member.fullName}</h3>
                <p className="text-purple-400 font-medium mb-3">{member.role}</p>
                {member.bio && <p className="text-gray-300 text-sm line-clamp-2 mb-4">{member.bio}</p>}

                {/* Skills */}
                {member.skills && member.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {member.skills.slice(0, 3).map((skill, i) => (
                            <span key={i} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                                {skill}
                            </span>
                        ))}
                        {member.skills.length > 3 && (
                            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                                +{member.skills.length - 3}
                            </span>
                        )}
                    </div>
                )}

                {/* Social Links */}
                {member.socialLinks && (
                    <div className="flex gap-3">
                        {member.socialLinks.github && (
                            <a
                                href={member.socialLinks.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="p-2 bg-white/10 hover:bg-purple-500/30 rounded-lg transition-colors"
                            >
                                <Github size={18} className="text-white" />
                            </a>
                        )}
                        {member.socialLinks.linkedin && (
                            <a
                                href={member.socialLinks.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="p-2 bg-white/10 hover:bg-purple-500/30 rounded-lg transition-colors"
                            >
                                <Linkedin size={18} className="text-white" />
                            </a>
                        )}
                        {member.socialLinks.facebook && (
                            <a
                                href={member.socialLinks.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="p-2 bg-white/10 hover:bg-purple-500/30 rounded-lg transition-colors"
                            >
                                <Facebook size={18} className="text-white" />
                            </a>
                        )}
                        {member.socialLinks.instagram && (
                            <a
                                href={member.socialLinks.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="p-2 bg-white/10 hover:bg-purple-500/30 rounded-lg transition-colors"
                            >
                                <Instagram size={18} className="text-white" />
                            </a>
                        )}
                        {member.socialLinks.email && (
                            <a
                                href={`mailto:${member.socialLinks.email}`}
                                onClick={(e) => e.stopPropagation()}
                                className="p-2 bg-white/10 hover:bg-purple-500/30 rounded-lg transition-colors"
                            >
                                <Mail size={18} className="text-white" />
                            </a>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    )
}
