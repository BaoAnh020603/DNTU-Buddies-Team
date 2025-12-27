import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Upload, X, Link2 } from 'lucide-react'
import { useRef, useState, useEffect } from 'react'
import { toast } from 'sonner'

interface ImageUploadProps {
    label?: string
    value: string
    onChange: (value: string, file?: File) => void
    id: string
    placeholder?: string
    required?: boolean
}

export default function ImageUpload({ label, value, onChange, id, placeholder, required }: ImageUploadProps) {
    const [preview, setPreview] = useState<string>(value)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const urlInputRef = useRef<HTMLInputElement>(null)

    // Sync preview với value từ props
    useEffect(() => {
        setPreview(value)
    }, [value])

    // Cleanup object URL khi component unmount hoặc file thay đổi
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl)
            }
        }
    }, [previewUrl])

    // Xử lý upload file
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Kích thước file không được vượt quá 5MB')
                return
            }

            // Cleanup previous object URL
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl)
            }

            // Tạo object URL cho preview
            const objectUrl = URL.createObjectURL(file)
            setPreviewUrl(objectUrl)
            setPreview('') // Clear URL preview

            // Chỉ gửi file, không gửi base64 string
            onChange('', file)
        }
    }

    // Xử lý paste URL
    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value
        // Cleanup object URL khi chuyển sang URL
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl)
            setPreviewUrl(null)
        }
        setPreview(url)
        onChange(url)
    }

    // Xóa ảnh
    const handleClear = () => {
        // Cleanup object URL
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl)
            setPreviewUrl(null)
        }
        setPreview('')
        onChange('')
        if (fileInputRef.current) fileInputRef.current.value = ''
        if (urlInputRef.current) urlInputRef.current.value = ''
    }

    return (
        <div className="space-y-2">
            <Label htmlFor={id}>
                {label} {required && <span className="text-red-500">*</span>}
            </Label>

            {/* Preview ảnh */}
            {(preview || previewUrl) && (
                <div className="relative w-full h-48 border rounded-lg overflow-hidden bg-muted">
                    <img src={previewUrl || preview} alt="Preview" className="w-full h-full object-cover" />
                    <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-8 w-8" onClick={handleClear}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}

            <div className="grid grid-cols-1  gap-2">
                {/* Upload file */}
                <div>
                    <Input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" id={`${id}_file`} />
                    <Button type="button" variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()}>
                        <Upload className="mr-2 h-4 w-4" />
                        Chọn file
                    </Button>
                </div>

                {/* Input URL */}
                <div className="relative">
                    <Input ref={urlInputRef} id={id} type="text" placeholder={placeholder} onChange={handleUrlChange} defaultValue={value} className="pr-10" />
                    <Link2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
            </div>

            <p className="text-xs text-muted-foreground">Chọn file, hoặc dán đường dẫn URL hình ảnh (tối đa 5MB)</p>
        </div>
    )
}
