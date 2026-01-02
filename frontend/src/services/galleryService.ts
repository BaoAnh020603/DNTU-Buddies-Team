import axios from 'axios'
import type { GalleryImage, GalleryResponse, GalleryStats } from '../types/gallery'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

class GalleryService {
  // Get all images
  async getAllImages(params?: {
    page?: number
    limit?: number
    category?: string
    search?: string
    sortBy?: string
    order?: 'asc' | 'desc'
  }): Promise<GalleryResponse> {
    const response = await axios.get(`${API_URL}/gallery`, { params })
    return response.data.metadata
  }

  // Get single image
  async getImageById(id: string): Promise<GalleryImage> {
    const response = await axios.get(`${API_URL}/gallery/${id}`)
    return response.data.metadata.image
  }

  // Upload image
  async uploadImage(formData: FormData): Promise<GalleryImage> {
    const token = localStorage.getItem('accessToken')
    const response = await axios.post(`${API_URL}/gallery`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data.metadata.image
  }

  // Update image
  async updateImage(id: string, data: Partial<GalleryImage>): Promise<GalleryImage> {
    const token = localStorage.getItem('accessToken')
    const response = await axios.put(`${API_URL}/gallery/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data.metadata.image
  }

  // Delete image
  async deleteImage(id: string): Promise<void> {
    const token = localStorage.getItem('accessToken')
    await axios.delete(`${API_URL}/gallery/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  // Toggle like
  async toggleLike(id: string): Promise<{ likes: number; isLiked: boolean }> {
    const token = localStorage.getItem('accessToken')
    const response = await axios.post(
      `${API_URL}/gallery/${id}/like`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return response.data.metadata
  }

  // Add comment
  async addComment(id: string, text: string): Promise<any> {
    const token = localStorage.getItem('accessToken')
    const response = await axios.post(
      `${API_URL}/gallery/${id}/comments`,
      { text },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return response.data.metadata.comments
  }

  // Delete comment
  async deleteComment(id: string, commentId: string): Promise<void> {
    const token = localStorage.getItem('accessToken')
    await axios.delete(`${API_URL}/gallery/${id}/comments/${commentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  // Get stats
  async getStats(): Promise<GalleryStats> {
    const response = await axios.get(`${API_URL}/gallery/stats`)
    return response.data.metadata
  }
}

export const galleryService = new GalleryService()
