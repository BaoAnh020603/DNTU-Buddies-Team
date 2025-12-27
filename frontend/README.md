# DNTU Buddies Team - Frontend

Website giới thiệu thành viên câu lạc bộ DNTU Buddies Team với giao diện 3D hiện đại.

## 🚀 Quick Start

### 1. Cài Đặt Dependencies
```bash
npm install
```

### 2. Cấu Hình Environment Variables
Copy `.env.example` thành `.env`:
```bash
cp .env.example .env
```

Cập nhật `VITE_API_URL` trong file `.env`:
```env
VITE_API_URL=http://localhost:5001/api
```

### 3. Khởi Động Development Server
```bash
npm run dev
```

Website sẽ chạy tại: http://localhost:5173

### 4. Build Production
```bash
npm run build
```

## ✨ Features

- **Authentication**: Đăng nhập/đăng xuất cho thành viên
- **Profile Management**: Chỉnh sửa thông tin cá nhân, upload avatar
- **Member Directory**: Danh sách thành viên với tìm kiếm, filter
- **3D Animations**: Hiệu ứng 3D với GSAP, Framer Motion, Three.js
- **Responsive Design**: Tối ưu cho mọi thiết bị
- **UN Blue Theme**: Màu sắc chuyên nghiệp theo chuẩn quốc tế

## 🎨 Tech Stack

### Core
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **React Router** - Routing

### Styling
- **Tailwind CSS 4** - Utility-first CSS
- **Radix UI** - Accessible components
- **Lucide React** - Icons

### Animations
- **Framer Motion** - React animations
- **GSAP** - Advanced animations
- **AOS** - Scroll animations
- **Three.js** - 3D graphics
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Three.js helpers
- **Lenis** - Smooth scrolling
- **Animate.css** - CSS animations

### State & Data
- **Axios** - HTTP client
- **Formik** - Form handling
- **Yup** - Form validation
- **js-cookie** - Cookie management

## 📁 Project Structure

```
frontend/
├── public/              # Static assets
│   └── logo.svg        # DNTU Buddies Team logo
├── src/
│   ├── components/     # Reusable UI components
│   │   └── ui/        # Shadcn/ui components
│   ├── features/      # Feature-based modules
│   │   ├── auth/      # Authentication
│   │   ├── home/      # Home page
│   │   ├── members/   # Member directory & detail
│   │   └── profile/   # Profile management
│   ├── layouts/       # Layout components
│   ├── lib/          # Utilities & helpers
│   ├── services/     # API services
│   ├── types/        # TypeScript types
│   ├── App.tsx       # Root component
│   └── main.tsx      # Entry point
├── index.html        # HTML template
└── vite.config.ts    # Vite configuration
```

## 🎯 Key Pages

### Home Page (`/`)
- Hero section với animation
- Nút đăng nhập/đăng xuất
- Nút chỉnh sửa hồ sơ (khi đã đăng nhập)

### Auth Page (`/auth`)
- Form đăng nhập
- Validation với Formik + Yup
- JWT token management

### Members Page (`/members`)
- Danh sách thành viên với grid layout
- Tìm kiếm theo tên, MSSV
- Filter theo vai trò, trạng thái
- Pagination

### Member Detail Page (`/members/:id`)
- Thông tin chi tiết thành viên
- Avatar, bio, description
- Skills, interests, achievements
- Social links
- 3D animations với GSAP, AOS, Three.js

### Profile Page (`/profile`)
- Chỉnh sửa thông tin cá nhân
- Upload avatar
- Cập nhật: tên, MSSV, ngành, năm học, bio
- Quản lý skills & interests (add/remove)
- Social links
- 3D effects với particles, tilt

## 🔐 Authentication Flow

1. User đăng nhập tại `/auth`
2. Backend trả về `accessToken` và `refreshToken`
3. Tokens được lưu trong cookies
4. Mỗi request gửi `accessToken` trong header
5. Khi token hết hạn, tự động refresh
6. Đăng xuất xóa tokens và redirect về `/auth`

## 🎨 UI Components

### Shadcn/ui Components
- Button, Input, Label
- Dialog, Dropdown Menu
- Avatar, Separator
- Tabs, Accordion
- Tooltip, Popover
- Switch

### Custom Components
- Navbar với responsive menu
- Footer với social links
- Loading states
- Error boundaries

## 🚀 Deployment

### Vercel (Khuyên Dùng)

#### Qua Dashboard
1. Push code lên GitHub
2. Import project vào Vercel
3. Cấu hình:
   - Framework: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Environment Variables:
   - `VITE_API_URL`: URL backend của bạn
5. Deploy

#### Qua CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Netlify

```bash
npm run build
# Upload folder dist/ lên Netlify
```

### Environment Variables cho Production

Tạo file `.env.production`:
```env
VITE_API_URL=https://your-backend.up.railway.app/api
```

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run analyze` - Analyze bundle size

## 🛠️ Development Tips

### Hot Module Replacement (HMR)
Vite hỗ trợ HMR, code changes sẽ reflect ngay lập tức.

### TypeScript
- Sử dụng types từ `src/types/`
- Tránh `any`, dùng `unknown` nếu cần
- Enable strict mode trong `tsconfig.json`

### Styling
- Dùng Tailwind utilities
- Custom colors trong `tailwind.config.js`
- UN Blue theme: `#0072CE`, `#003F87`, `#00A0DC`

### Animations
- Framer Motion cho component animations
- GSAP cho timeline & scroll animations
- AOS cho scroll reveal effects
- Three.js cho 3D graphics

## 🐛 Troubleshooting

### API không kết nối
- Check `VITE_API_URL` trong `.env`
- Verify backend đang chạy
- Check CORS settings trong backend

### Build errors
```bash
# Clear cache
rm -rf node_modules dist
npm install
npm run build
```

### TypeScript errors
```bash
# Regenerate types
npm run build
```

## 📚 Documentation

- [React](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vite.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
- [GSAP](https://gsap.com)
- [Three.js](https://threejs.org)

## 🚀 Deployment Guide

Xem file `DEPLOYMENT.md` ở root folder để biết chi tiết về:
- Deploy lên Vercel
- Cấu hình environment variables
- Custom domain setup
- CI/CD với GitHub Actions
