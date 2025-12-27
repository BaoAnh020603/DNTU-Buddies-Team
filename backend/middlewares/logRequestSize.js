// Middleware để log kích thước request body
const logRequestSize = (req, res, next) => {
    console.log('=== REQUEST SIZE DEBUG ===')

    // Log kích thước của req.body
    if (req.body) {
        const bodySize = JSON.stringify(req.body).length
        console.log(`Body size: ${bodySize} bytes (${(bodySize / 1024).toFixed(2)} KB)`)

        // Log từng field trong body
        Object.keys(req.body).forEach((key) => {
            const fieldValue = req.body[key]
            const fieldSize = typeof fieldValue === 'string' ? fieldValue.length : JSON.stringify(fieldValue).length
            console.log(`Field "${key}": ${fieldSize} bytes (${(fieldSize / 1024).toFixed(2)} KB)`)

            // Nếu field quá lớn, log preview
            if (fieldSize > 100000) {
                // > 100KB
                console.log(`⚠️  Large field detected: ${key}`)
                if (typeof fieldValue === 'string' && fieldValue.startsWith('data:image/')) {
                    console.log(`   Type: Base64 image`)
                    console.log(`   Preview: ${fieldValue.substring(0, 50)}...`)
                }
            }
        })
    }

    // Log files nếu có
    if (req.files) {
        console.log(`Files count: ${Object.keys(req.files).length}`)
        Object.keys(req.files).forEach((key) => {
            const files = req.files[key]
            if (Array.isArray(files)) {
                files.forEach((file, index) => {
                    console.log(`File "${key}[${index}]": ${file.size} bytes (${(file.size / 1024).toFixed(2)} KB)`)
                })
            }
        })
    }

    console.log('========================')
    next()
}

module.exports = logRequestSize
