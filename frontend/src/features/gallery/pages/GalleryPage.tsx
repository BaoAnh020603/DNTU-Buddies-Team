import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Image as ImageIcon, Upload, Heart, MessageCircle, Calendar, Tag, X, Plus, Search, Filter } from 'lucide-react'
import { galleryService } from '../../../services/galleryService'
import type { GalleryImage } from '../../../types/gallery'
import { useNavigate } from 'react-router-dom'
import { TokenStorage } from '@/contexts/AuthContext'
import { OptimizedBackground } from '../../../components/OptimizedBackground'

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [category, setCategory] = useState<string>('')
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchImages()
    checkAuth()
  }, [category, search])

  const checkAuth = () => {
    const token = TokenStorage.getCookieToken()
    setIsLoggedIn(!!token)
  }

  const fetchImages = async () => {
    try {
      setLoading(true)
      const response = await galleryService.getAllImages({
        category: category || undefined,
        search: search || undefined,
        limit: 50,
      })
      setImages(response.images)
    } catch (error) {
      console.error('Error fetching images:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (id: string) => {
    if (!isLoggedIn) {
      navigate('/auth')
      return
    }
    try {
      await galleryService.toggleLike(id)
      fetchImages()
    } catch (error) {
      console.error('Error liking image:', error)
    }
  }

  const categories = [
    { value: '', label: 'Tất cả', icon: '🌟' },
    { value: 'event', label: 'Sự kiện', icon: '🎉' },
    { value: 'meeting', label: 'Gặp gỡ', icon: '🤝' },
    { value: 'activity', label: 'Hoạt động', icon: '⚡' },
    { value: 'trip', label: 'Chuyến đi', icon: '✈️' },
    { value: 'other', label: 'Khác', icon: '📸' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      <OptimizedBackground />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-[#003F87] via-[#0072CE] to-[#00A0DC] bg-clip-text text-transparent mb-2">
              📸 Kho Ảnh Kỷ Niệm
            </h1>
            <p className="text-gray-600 text-lg">Những khoảnh khắc đáng nhớ của DNTU Buddies Team</p>
          </div>

          {isLoggedIn && (
            <motion.button
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowUploadModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-[#0072CE] to-[#00A0DC] text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg"
            >
              <Upload size={20} />
              Đăng ảnh
            </motion.button>
          )}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 space-y-4"
        >
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm ảnh..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-xl rounded-2xl border-2 border-white/50 focus:border-[#0072CE] outline-none transition-all"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <motion.button
                key={cat.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCategory(cat.value)}
                className={`px-5 py-2 rounded-xl font-bold transition-all ${
                  category === cat.value
                    ? 'bg-gradient-to-r from-[#0072CE] to-[#00A0DC] text-white shadow-lg'
                    : 'bg-white/80 text-gray-700 hover:bg-white'
                }`}
              >
                <span className="mr-2">{cat.icon}</span>
                {cat.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square bg-white/60 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : images.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-32 h-32 bg-gradient-to-br from-[#0072CE] to-[#003F87] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <ImageIcon className="text-white" size={60} />
            </div>
            <h3 className="text-3xl font-black text-[#003F87] mb-4">Chưa có ảnh nào</h3>
            <p className="text-xl text-gray-600">Hãy là người đầu tiên đăng ảnh kỷ niệm!</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((image, index) => (
              <motion.div
                key={image._id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -10, scale: 1.03 }}
                onClick={() => setSelectedImage(image)}
                className="group cursor-pointer relative aspect-square rounded-3xl overflow-hidden bg-white/80 backdrop-blur-xl border-2 border-white/50 shadow-lg"
              >
                <img
                  src={image.imageUrl}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-bold text-lg mb-2">{image.title}</h3>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Heart size={16} fill={image.likes.length > 0 ? 'currentColor' : 'none'} />
                        {image.likes.length}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle size={16} />
                        {image.comments.length}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Image Detail Modal */}
      <AnimatePresence>
        {selectedImage && (
          <ImageDetailModal
            image={selectedImage}
            onClose={() => setSelectedImage(null)}
            onLike={handleLike}
            isLoggedIn={isLoggedIn}
            onUpdate={fetchImages}
          />
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <UploadModal
            onClose={() => setShowUploadModal(false)}
            onSuccess={() => {
              setShowUploadModal(false)
              fetchImages()
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// Image Detail Modal Component
function ImageDetailModal({
  image,
  onClose,
  onLike,
  isLoggedIn,
  onUpdate,
}: {
  image: GalleryImage
  onClose: () => void
  onLike: (id: string) => void
  isLoggedIn: boolean
  onUpdate: () => void
}) {
  const [comment, setComment] = useState('')

  const handleAddComment = async () => {
    if (!comment.trim()) return
    try {
      await galleryService.addComment(image._id, comment)
      setComment('')
      onUpdate()
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
      >
        {/* Image */}
        <div className="md:w-2/3 bg-black flex items-center justify-center">
          <img src={image.imageUrl} alt={image.title} className="max-w-full max-h-[90vh] object-contain" />
        </div>

        {/* Details */}
        <div className="md:w-1/3 p-6 flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-black text-[#003F87] mb-2">{image.title}</h2>
              <p className="text-gray-600">{image.description}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => onLike(image._id)}
              className="flex items-center gap-2 text-red-500 hover:scale-110 transition-transform"
            >
              <Heart size={20} fill={image.likes.length > 0 ? 'currentColor' : 'none'} />
              <span className="font-bold">{image.likes.length}</span>
            </button>
            <span className="flex items-center gap-2 text-gray-600">
              <MessageCircle size={20} />
              <span className="font-bold">{image.comments.length}</span>
            </span>
          </div>

          {/* Tags */}
          {image.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {image.tags.map((tag, i) => (
                <span key={i} className="px-3 py-1 bg-[#0072CE]/10 text-[#0072CE] rounded-full text-sm font-bold">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Comments */}
          <div className="flex-1 overflow-y-auto mb-4">
            <h3 className="font-bold text-lg mb-3">Bình luận</h3>
            <div className="space-y-3">
              {image.comments.map((comment) => (
                <div key={comment._id} className="flex gap-3">
                  <img src={comment.user.avatar} alt={comment.user.fullName} className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <p className="font-bold text-sm">{comment.user.fullName}</p>
                    <p className="text-gray-600 text-sm">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Comment */}
          {isLoggedIn && (
            <div className="flex gap-2">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                placeholder="Thêm bình luận..."
                className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-[#0072CE] outline-none"
              />
              <button
                onClick={handleAddComment}
                className="px-4 py-2 bg-gradient-to-r from-[#0072CE] to-[#00A0DC] text-white rounded-xl font-bold"
              >
                Gửi
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

// Upload Modal Component
function UploadModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('other')
  const [tags, setTags] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>('')
  const [uploading, setUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setPreview(URL.createObjectURL(selectedFile))
    }
  }

  const handleUpload = async () => {
    if (!file || !title) return

    try {
      setUploading(true)
      const formData = new FormData()
      formData.append('image', file)
      formData.append('title', title)
      formData.append('description', description)
      formData.append('category', category)
      formData.append('tags', tags)

      await galleryService.uploadImage(formData)
      onSuccess()
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-2xl w-full p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-black text-[#003F87]">Đăng ảnh mới</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Chọn ảnh *</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0072CE] outline-none"
            />
            {preview && (
              <img src={preview} alt="Preview" className="mt-4 w-full h-64 object-cover rounded-xl" />
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Tiêu đề *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0072CE] outline-none"
              placeholder="Nhập tiêu đề..."
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Mô tả</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0072CE] outline-none resize-none"
              placeholder="Nhập mô tả..."
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Danh mục</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0072CE] outline-none"
            >
              <option value="event">Sự kiện</option>
              <option value="meeting">Gặp gỡ</option>
              <option value="activity">Hoạt động</option>
              <option value="trip">Chuyến đi</option>
              <option value="other">Khác</option>
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Tags (phân cách bằng dấu phẩy)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0072CE] outline-none"
              placeholder="vd: buddies, event2024, fun"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleUpload}
              disabled={!file || !title || uploading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-[#0072CE] to-[#00A0DC] text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Đang tải...' : 'Đăng ảnh'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
