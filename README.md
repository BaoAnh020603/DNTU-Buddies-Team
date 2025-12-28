# 🌐 DNTU Buddies Team - Member Management System

<div align="center">

![DNTU Buddies Team](https://img.shields.io/badge/DNTU-Buddies%20Team-0072CE?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Live-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-Private-red?style=for-the-badge)

**Website quản lý thành viên chính thức của CLB DNTU Buddies Team**

[🌐 Website](https://dntu-buddies-team.vercel.app) • [📖 Documentation](./HUONG_DAN_DEPLOY_CHI_TIET.md) • [🐛 Report Bug](https://github.com/BaoAnh020603/DNTU-Buddies-Team/issues)

</div>

---

## 📋 Giới Thiệu

**DNTU Buddies Team** là hệ thống quản lý thành viên hiện đại dành cho CLB DNTU Buddies Team - nơi kết nối sinh viên Việt Nam và bạn bè quốc tế tại Đại học Đà Nẵng.

Website được xây dựng với giao diện 3D ấn tượng, giúp các thành viên:
- ✨ Tạo và quản lý profile cá nhân với hiệu ứng 3D
- 👥 Xem danh sách và thông tin các thành viên khác
- 🎯 Cập nhật thông tin: ảnh đại diện, vai trò, kỹ năng, sở thích
- 🌍 Kết nối qua các mạng xã hội
- 📊 Theo dõi hoạt động và thành tích trong CLB

---

## 🚀 Demo

**🌐 Production:** [https://dntu-buddies-team.vercel.app](https://dntu-buddies-team.vercel.app)

**🔐 Tài khoản demo:**
- Email: `admin@dntubuddiesteam.com`
- Password: `admin123`

---

## ✨ Tính Năng Chính

### 🎨 Giao Diện & Trải Nghiệm
- ⚡ Hiệu ứng 3D mượt mà với GSAP, AOS, Framer Motion
- 🎭 Animations chuyên nghiệp trên mọi trang
- 📱 Responsive design - hoạt động tốt trên mọi thiết bị
- 🚀 **Tối ưu hiệu năng - chạy mượt mà không lag trên mọi nền tảng**
- 💻 **Đa nền tảng: Desktop, Tablet, Mobile (iOS & Android)**
- ⚙️ **Lazy loading & Code splitting để tải nhanh**
- 🎯 **Optimized animations - tự động giảm hiệu ứng trên thiết bị yếu**
- 🌈 Theme màu UN Blue (#0072CE, #00A0DC, #003F87)

### 👤 Quản Lý Profile
- 📸 Upload và quản lý ảnh đại diện (Cloudinary)
- 📝 Cập nhật thông tin cá nhân đầy đủ:
  - Tên tiếng Anh, MSSV, lớp, ngành học
  - Quốc tịch, ngày sinh
  - Vai trò trong CLB
  - Quote, bio, giới thiệu
  - Kỹ năng, sở thích
  - Links mạng xã hội (Facebook, Instagram, LinkedIn)
- 🏆 Theo dõi thành tích: số sự kiện tham gia, số bạn quốc tế đã gặp

### 👥 Danh Sách Thành Viên
- 🔍 Xem danh sách tất cả thành viên
- 🎴 Member cards với hiệu ứng 3D
- 📊 Thống kê tổng quan về CLB
- 🔗 Xem chi tiết profile từng thành viên

### 🔐 Bảo Mật
- 🔒 JWT Authentication với Access & Refresh Tokens
- 🛡️ Password hashing với bcrypt
- 🚫 Protected routes - chỉ thành viên mới truy cập được
- ⚙️ Role-based access control (Admin/Member)

### 🚀 Hiệu Năng & Tối Ưu
- ⚡ **Vite build tool** - build cực nhanh, HMR tức thì
- 📦 **Code splitting** - chỉ tải code cần thiết
- 🖼️ **Image optimization** - Cloudinary tự động resize & compress
- 🎯 **Lazy loading** - components và images load khi cần
- 💾 **Caching** - giảm request API không cần thiết
- 🌐 **CDN** - Vercel Edge Network phục vụ toàn cầu
- 📱 **Mobile-first** - tối ưu cho thiết bị di động trước
- 🔄 **Progressive enhancement** - hoạt động tốt ngay cả khi JS bị tắt

---

## 🛠️ Công Nghệ Sử Dụng

### Frontend
- ⚛️ **React 18** - UI framework
- 📘 **TypeScript** - Type safety
- 🎨 **Tailwind CSS** - Styling
- 🎭 **Framer Motion** - Animations
- 📊 **GSAP** - Advanced animations
- 🎬 **AOS** - Scroll animations
- 🔄 **React Router** - Navigation
- 📡 **Axios** - HTTP client
- 🎯 **Zustand** - State management
- ⚡ **Vite** - Build tool & dev server

### Backend
- 🟢 **Node.js** - Runtime
- 🚂 **Express.js** - Web framework
- 🍃 **MongoDB** - Database
- 🔐 **JWT** - Authentication
- 🔒 **bcrypt** - Password hashing
- ☁️ **Cloudinary** - Image storage & optimization
- ✅ **Express Validator** - Input validation
- 🔄 **Mongoose** - MongoDB ODM

### DevOps & Deployment
- 🐙 **GitHub** - Version control
- ▲ **Vercel** - Frontend hosting (Edge Network)
- 🎨 **Render** - Backend hosting
- 🍃 **MongoDB Atlas** - Database hosting (Cloud)
- ☁️ **Cloudinary** - CDN for images

---

## 📦 Cấu Trúc Project

```
DNTU-Buddies-Team/
├── frontend/                 # React + TypeScript frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── features/        # Feature-based modules
│   │   │   ├── auth/       # Authentication
│   │   │   ├── home/       # Homepage
│   │   │   ├── members/    # Members list & detail
│   │   │   └── profile/    # Profile management
│   │   ├── services/       # API services
│   │   ├── store/          # Zustand stores
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utilities
│   └── package.json
│
├── backend/                 # Node.js + Express backend
│   ├── configs/            # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middlewares/        # Custom middlewares
│   ├── models/             # MongoDB models
│   ├── routers/            # API routes
│   ├── services/           # Business logic
│   ├── utils/              # Utilities
│   ├── scripts/            # Database scripts
│   └── package.json
│
└── README.md
```

---

## 🚀 Hướng Dẫn Cài Đặt

### Yêu Cầu
- Node.js >= 18.x
- MongoDB >= 6.x
- npm hoặc yarn

### 1. Clone Repository

```bash
git clone https://github.com/BaoAnh020603/DNTU-Buddies-Team.git
cd DNTU-Buddies-Team
```

### 2. Setup Backend

```bash
cd backend
npm install

# Tạo file .env
cp .env.example .env
# Cập nhật các biến môi trường trong .env
```

**Backend .env:**
```env
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/dntu-buddies
ACCESS_TOKEN_SECRET=your-access-token-secret
REFRESH_TOKEN_SECRET=your-refresh-token-secret
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
```

```bash
# Khởi động backend
npm start
```

### 3. Setup Frontend

```bash
cd frontend
npm install

# Tạo file .env
cp .env.example .env
```

**Frontend .env:**
```env
VITE_API_URL=http://localhost:5001/api
```

```bash
# Khởi động frontend
npm run dev
```

### 4. Truy Cập

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5001/api

---

## 📚 API Documentation

### Authentication
```
POST   /api/auth/register     # Đăng ký (chỉ admin)
POST   /api/auth/login        # Đăng nhập
POST   /api/auth/logout       # Đăng xuất
POST   /api/auth/refresh      # Refresh token
GET    /api/auth/me           # Lấy thông tin user hiện tại
```

### Profile
```
GET    /api/profile           # Lấy profile của mình
PUT    /api/profile           # Cập nhật profile
POST   /api/profile/avatar    # Upload avatar
```

### Members
```
GET    /api/members           # Lấy danh sách members
GET    /api/members/:id       # Lấy chi tiết member
GET    /api/members/stats     # Lấy thống kê
```

---

## 💻 Tương Thích Đa Nền Tảng

### Desktop
- ✅ Windows 10/11
- ✅ macOS 10.15+
- ✅ Linux (Ubuntu, Fedora, etc.)
- ✅ Chrome, Firefox, Safari, Edge (latest versions)

### Mobile
- ✅ iOS 13+ (iPhone, iPad)
- ✅ Android 8+ (Chrome, Samsung Internet)
- ✅ Responsive design tự động điều chỉnh
- ✅ Touch gestures được tối ưu

### Tablet
- ✅ iPad (Safari, Chrome)
- ✅ Android Tablets
- ✅ Layout tối ưu cho màn hình trung bình

### Hiệu Năng
- ⚡ **First Contentful Paint:** < 1.5s
- 🎯 **Time to Interactive:** < 3s
- 📊 **Lighthouse Score:** 90+
- 🚀 **60 FPS animations** trên mọi thiết bị
- 💾 **Bundle size:** < 500KB (gzipped)

---

## 👥 Thành Viên

Hệ thống hiện có **37 thành viên** đã đăng ký:

1. Đinh Thị Hải Anh
2. Lê Hoàng Yến Nhi
3. Trần Quang Linh
4. Cấn Lê Thủy Tiên
5. Hồ Thị Mỹ Duyên
... và 32 thành viên khác

📧 **Format email:** `[tên không dấu]@dntubuddiesteam.com`  
🔑 **Format password:** `[tên không dấu]123`

---

## 🔧 Scripts Hữu Ích

### Backend
```bash
npm start              # Khởi động server
npm run dev            # Development mode với nodemon
npm run seed           # Tạo admin account
npm run create-multiple-members  # Tạo 37 tài khoản members
```

### Frontend
```bash
npm run dev            # Development server
npm run build          # Build production
npm run preview        # Preview production build
npm run lint           # Lint code
```

---

## 🌍 Deployment

Website đã được deploy lên production:

- **Frontend:** Vercel - [https://dntu-buddies-team.vercel.app](https://dntu-buddies-team.vercel.app)
- **Backend:** Render - [https://dntu-buddies-team.onrender.com](https://dntu-buddies-team.onrender.com)
- **Database:** MongoDB Atlas

📖 **Chi tiết:** Xem [HUONG_DAN_DEPLOY_CHI_TIET.md](./HUONG_DAN_DEPLOY_CHI_TIET.md)

---

## 🤝 Đóng Góp

Dự án này được phát triển và duy trì bởi DNTU Buddies Team.

**Liên hệ:**
- 📧 Email: admin@dntubuddiesteam.com
- 🌐 Website: https://dntu-buddies-team.vercel.app

---

## 📄 License

© 2024 DNTU Buddies Team. All rights reserved.

Dự án này là tài sản riêng của CLB DNTU Buddies Team và chỉ dành cho mục đích nội bộ.

---

## 🙏 Cảm Ơn

Cảm ơn tất cả các thành viên DNTU Buddies Team đã đóng góp và sử dụng hệ thống!

**Made with 💙 by DNTU Buddies Team**

---

<div align="center">

### 🌟 Nếu bạn thích project này, hãy cho chúng tôi một ⭐!

</div>
