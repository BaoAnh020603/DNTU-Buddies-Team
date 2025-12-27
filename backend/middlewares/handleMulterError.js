// Middleware xử lý Multer errors
const handleMulterError = (error, req, res, next) => {
    if (error instanceof require('multer').MulterError) {
        console.error('Multer Error:', error)

        switch (error.code) {
            case 'LIMIT_FILE_SIZE':
                return res.status(400).json({
                    success: false,
                    message: 'File quá lớn. Kích thước tối đa là 10MB',
                    error: 'FILE_TOO_LARGE',
                })
            case 'LIMIT_FIELD_VALUE':
                return res.status(400).json({
                    success: false,
                    message: 'Dữ liệu field quá lớn. Có thể do ảnh base64 quá lớn',
                    error: 'FIELD_VALUE_TOO_LONG',
                })
            case 'LIMIT_FIELDS':
                return res.status(400).json({
                    success: false,
                    message: 'Quá nhiều fields trong form',
                    error: 'TOO_MANY_FIELDS',
                })
            case 'LIMIT_FILES':
                return res.status(400).json({
                    success: false,
                    message: 'Quá nhiều files upload',
                    error: 'TOO_MANY_FILES',
                })
            default:
                return res.status(400).json({
                    success: false,
                    message: `Upload error: ${error.message}`,
                    error: error.code,
                })
        }
    }

    // Nếu không phải Multer error thì pass cho error handler khác
    next(error)
}

module.exports = handleMulterError
