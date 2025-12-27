# DNTU Buddies Team - Backend API

API cho hệ thống giới thiệu thành viên DNTU Buddies Team.

## 🚀 Quick Start

### 1. Cài Đặt Dependencies
```bash
npm install
```

### 2. Cấu Hình Environment Variables
Copy `.env.example` thành `.env` và cập nhật thông tin:
```bash
cp .env.example .env
```

### 3. Khởi Động Server
```bash
# Development
npm run dev

# Production
npm start
```

### 4. Seed Database (Tạo Admin)
```bash
npm run seed
```

## 👥 Quản Lý Tài Khoản Thành Viên

### Tạo Tài Khoản Mới (Interactive)
```bash
npm run create-member-admin
```

Script sẽ hỏi thông tin:
- Họ và tên
- Email
- MSSV
- Ngành học
- Năm học
- Mật khẩu (mặc định: tên + "123")

### Tạo Tài Khoản Nhanh (Script)
Chỉnh sửa `scripts/createMember.js` và chạy:
```bash
npm run create-member
```

## 📚 API Endpoints

### Authentication

- `POST /api/auth/login` - Đăng nhập
  ```json
  {
    "email": "admin@dntubuddiesteam.com",
    "password": "admin123"
  }
  ```

- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Đăng xuất

### Members (Public)

- `GET /api/members` - Lấy danh sách thành viên
  - Query params: `page`, `limit`, `search`, `role`, `isActive`, `sortBy`, `order`
  
- `GET /api/members/:id` - Lấy thông tin thành viên theo ID

- `GET /api/members/stats` - Thống kê thành viên

### Profile (Authenticated)

- `GET /api/profile/me` - Lấy thông tin profile của user đang đăng nhập
- `PUT /api/profile/me` - Cập nhật profile
  - Hỗ trợ upload avatar (multipart/form-data)
  - Fields: `fullName`, `bio`, `description`, `skills`, `interests`, `socialLinks`, `major`, `year`, `studentId`

## 🔐 Environment Variables

```env
# Server
PORT=5001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/dntu-buddies

# JWT Secrets (tạo bằng: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
ACCESS_TOKEN_SECRET=your_access_token_secret_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here

# Cloudinary (lấy từ https://cloudinary.com/console)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL (cho CORS)
FRONTEND_URL=http://localhost:5173
```

## 📁 Project Structure

```
backend/
├── configs/          # Database & Cloudinary config
├── controllers/      # Request handlers
├── core/            # Error & Success response classes
├── middlewares/     # Auth, validation, error handling
├── models/          # MongoDB schemas
├── routers/         # API routes
├── scripts/         # Utility scripts (seed, create member)
├── services/        # Business logic
├── utils/           # Helper functions
└── index.js         # Entry point
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run seed` - Seed database with admin account
- `npm run create-member` - Create member account (edit script first)
- `npm run create-member-admin` - Interactive member creation

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cloudinary** - Image upload & storage
- **multer** - File upload handling
- **express-validator** - Request validation
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables

## 🚀 Deployment

Xem file `DEPLOYMENT.md` ở root folder để biết chi tiết về:
- Deploy lên Railway/Render
- Cấu hình MongoDB Atlas
- Setup Cloudinary
- Quản lý environment variables
- Tạo tài khoản thành viên trên production
