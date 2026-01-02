export interface GalleryImage {
  _id: string
  title: string
  description: string
  imageUrl: string
  cloudinaryId: string
  category: 'event' | 'meeting' | 'activity' | 'trip' | 'other'
  tags: string[]
  uploadedBy: {
    _id: string
    fullName: string
    avatar: string
  }
  likes: string[]
  comments: GalleryComment[]
  eventDate: string | null
  isPublic: boolean
  displayOrder: number
  createdAt: string
  updatedAt: string
}

export interface GalleryComment {
  _id: string
  user: {
    _id: string
    fullName: string
    avatar: string
  }
  text: string
  createdAt: string
}

export interface GalleryStats {
  totalImages: number
  categories: {
    _id: string
    count: number
  }[]
  recentUploads: GalleryImage[]
}

export interface GalleryResponse {
  images: GalleryImage[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
