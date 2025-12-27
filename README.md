# 🚀 HƯỚNG DẪN DEPLOY CHI TIẾT - DNTU BUDDIES TEAM

## 📋 Tình Trạng Hiện Tại
- ✅ Code đã hoàn thiện
- ✅ 36 tài khoản members đã tạo trong database local
- ✅ Tất cả tính năng đã test thành công trên local
- 🎯 Mục tiêu: Deploy lên production để mọi người sử dụng

---

# PHẦN 1: CHUẨN BỊ

## Bước 1.1: Kiểm Tra Code
```bash
# Mở terminal tại thư mục project
cd C:\Users\ADMIN\Desktop\Downloads\DNTU-Buddies-Team

# Kiểm tra status
git status
```

## Bước 1.2: Commit Code Hiện Tại
```bash
# Add tất cả thay đổi
git add .

# Commit với message
git commit -m "Ready for production deployment - 36 members created"

# Nếu chưa có git, chạy trước:
git init
git branch -M main
```

---

# PHẦN 2: SETUP MONGODB ATLAS (DATABASE CLOUD)

## Bước 2.1: Tạo Tài Khoản MongoDB Atlas

1. **Truy cập:** https://www.mongodb.com/cloud/atlas/register
2. **Đăng ký:**
   - Chọn "Sign up with Google" (nhanh nhất)
   - Hoặc dùng email + password
3. **Xác nhận email** (nếu dùng email)

## Bước 2.2: Tạo Organization & Project

1. Sau khi đăng nhập, click **"Create an Organization"**
   - Organization Name: `DNTU Buddies Team`
   - Click **"Next"**
   - Click **"Create Organization"**

2. Click **"New Project"**
   - Project Name: `dntu-buddies-production`
   - Click **"Next"**
   - Click **"Create Project"**

## Bước 2.3: Tạo Database Cluster

1. Click **"Build a Database"** hoặc **"Create"**

2. **Chọn Plan:**
   - Chọn **"M0 FREE"** (miễn phí mãi mãi)
   - ✅ 512 MB Storage
   - ✅ Shared RAM
   - ✅ Đủ cho 1000-2000 members

3. **Chọn Provider & Region:**
   - **Provider:** AWS (khuyến nghị)
   - **Region:** Singapore (ap-southeast-1) - gần Việt Nam nhất
   - Click **"Create Cluster"**

4. **Cluster Name:** `dntu-buddies-team`

5. Click **"Create"** và đợi 3-5 phút

## Bước 2.4: Tạo Database User

1. Trong khi đợi cluster, click **"Database Access"** (menu bên trái)

2. Click **"+ ADD NEW DATABASE USER"**

3. **Cấu hình:**
   - **Authentication Method:** Password
   - **Username:** `dntuadmin`
   - **Password:** Click **"Autogenerate Secure Password"**
   - **⚠️ QUAN TRỌNG:** Copy password và lưu lại!
     ```
     VD: Abc123XyzDef456Ghi789
     ```
   - **Database User Privileges:** 
     - Chọn **"Built-in Role"**
     - Chọn **"Atlas admin"** (full quyền)

4. Click **"Add User"**

## Bước 2.5: Whitelist IP Address

1. Click **"Network Access"** (menu bên trái)

2. Click **"+ ADD IP ADDRESS"**

3. Click **"ALLOW ACCESS FROM ANYWHERE"**
   - IP Address: `0.0.0.0/0` (tự động điền)
   - Comment: `Allow all IPs for production`

4. Click **"Confirm"**

## Bước 2.6: Lấy Connection String

1. Click **"Database"** (menu bên trái)

2. Đợi cluster status = **"Active"** (màu xanh lá)

3. Click nút **"Connect"** trên cluster `dntu-buddies-team`

4. Chọn **"Drivers"**

5. **Driver:** Node.js, **Version:** 5.5 or later

6. **Copy connection string:**
   ```
   mongodb+srv://dntuadmin:<password>@dntu-buddies-team.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

7. **Sửa connection string:**
   - Thay `<password>` bằng password đã copy ở bước 2.4
   - Thêm `/dntu-buddies-team` trước dấu `?`
   
   **Kết quả:**
   ```
   mongodb+srv://dntuadmin:Abc123XyzDef456Ghi789@dntu-buddies-team.xxxxx.mongodb.net/dntu-buddies-team?retryWrites=true&w=majority
   ```

8. **⚠️ LƯU LẠI CONNECTION STRING NÀY VÀO NOTEPAD!**

---

# PHẦN 3: MIGRATE DATA TỪ LOCAL LÊN ATLAS

## Bước 3.1: Cập Nhật Connection String Tạm Thời

1. Mở file `backend/.env`

2. **Backup connection string cũ:**
   ```env
   # Local (backup)
   # MONGODB_URI=mongodb://localhost:27017/dntu-buddies
   
   # Production (temporary for migration)
   MONGODB_URI=mongodb+srv://dntuadmin:Abc123XyzDef456Ghi789@dntu-buddies-team.xxxxx.mongodb.net/dntu-buddies-team?retryWrites=true&w=majority
   ```

3. **Lưu file**

## Bước 3.2: Migrate 36 Tài Khoản Lên Atlas

```bash
# Mở terminal tại thư mục backend
cd backend

# Chạy script tạo 36 tài khoản (sẽ tạo trên Atlas)
npm run create-multiple-members
```

**Kết quả:**
```
✅ Tạo thành công: 36
⚠️  Bỏ qua (đã tồn tại): 0
❌ Lỗi: 0
```

## Bước 3.3: Tạo Tài Khoản Admin

```bash
# Tạo admin
npm run seed
```

**Lưu thông tin admin:**
- Email: `admin@dntubuddiesteam.com`
- Password: `admin123`

## Bước 3.4: Đổi Lại Connection String

1. Mở file `backend/.env`

2. **Đổi lại về localhost:**
   ```env
   # Local
   MONGODB_URI=mongodb://localhost:27017/dntu-buddies
   
   # Production (đã migrate xong)
   # MONGODB_URI=mongodb+srv://dntuadmin:Abc123XyzDef456Ghi789@...
   ```

3. **Lưu file**

---

# PHẦN 4: PUSH CODE LÊN GITHUB

## Bước 4.1: Tạo Repository Trên GitHub

1. Truy cập: https://github.com/new

2. **Cấu hình:**
   - **Repository name:** `dntu-buddies-team`
   - **Description:** DNTU Buddies Team - Member Management System
   - **Visibility:** Private (hoặc Public)
   - **KHÔNG** check "Add a README file"

3. Click **"Create repository"**

4. **Lưu lại URL:**
   ```
   https://github.com/[YOUR_USERNAME]/dntu-buddies-team.git
   ```

## Bước 4.2: Tạo .gitignore

1. Tạo file `.gitignore` tại thư mục gốc (nếu chưa có):

```bash
# Tạo file .gitignore
echo node_modules/ > .gitignore
echo .env >> .gitignore
echo dist/ >> .gitignore
echo build/ >> .gitignore
echo .DS_Store >> .gitignore
```

## Bước 4.3: Push Code

```bash
# Tại thư mục gốc project
cd C:\Users\ADMIN\Desktop\Downloads\DNTU-Buddies-Team

# Khởi tạo git (nếu chưa có)
git init

# Add tất cả files
git add .

# Commit
git commit -m "Initial commit - DNTU Buddies Team Production Ready"

# Add remote (thay YOUR_USERNAME bằng username GitHub của bạn)
git remote add origin https://github.com/YOUR_USERNAME/dntu-buddies-team.git

# Push
git branch -M main
git push -u origin main
```

**Nếu yêu cầu đăng nhập:**
- **Username:** GitHub username của bạn
- **Password:** Dùng **Personal Access Token** (KHÔNG phải password GitHub)

**Tạo Personal Access Token:**
1. Vào: https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. **Note:** `DNTU Buddies Team Deploy`
4. **Expiration:** 90 days (hoặc No expiration)
5. **Scopes:** Check **repo** (tất cả)
6. Click **"Generate token"**
7. **Copy token** và dùng làm password khi push

---

# PHẦN 5: DEPLOY BACKEND LÊN RENDER

## Bước 5.1: Tạo Tài Khoản Render

1. Truy cập: https://render.com

2. Click **"Get Started"**

3. **Sign up with GitHub** (khuyến nghị)

4. **Authorize Render** truy cập GitHub

## Bước 5.2: Tạo Web Service

1. Trong Render Dashboard, click **"New +"** → **"Web Service"**

2. **Connect Repository:**
   - Click **"Connect account"** nếu chưa connect
   - Tìm repository: `dntu-buddies-team`
   - Click **"Connect"**

## Bước 5.3: Cấu Hình Web Service

**Basic Settings:**
- **Name:** `dntu-buddies-backend`
- **Region:** Singapore (Southeast Asia)
- **Branch:** `main`
- **Root Directory:** `backend`
- **Runtime:** Node
- **Build Command:** `npm install`
- **Start Command:** `npm start`

**Instance Type:**
- Chọn **"Free"** ($0/month)
  - ✅ 512 MB RAM
  - ✅ 750 hours/month
  - ⚠️ Sleep sau 15 phút không hoạt động

## Bước 5.4: Environment Variables

Scroll xuống **"Environment Variables"**, click **"Add Environment Variable"**

**Thêm từng biến sau:**

```
NODE_ENV = production
```

```
PORT = 10000
```

```
MONGODB_URI = mongodb+srv://dntuadmin:Abc123XyzDef456Ghi789@dntu-buddies-team.xxxxx.mongodb.net/dntu-buddies-team?retryWrites=true&w=majority
```
⚠️ Paste connection string từ bước 2.6!

```
JWT_SECRET = dntu-buddies-team-super-secret-jwt-key-production-2024-change-this-to-random-string
```

```
JWT_EXPIRES_IN = 7d
```

```
FRONTEND_URL = https://dntu-buddies-team.vercel.app
```
⚠️ Tạm thời để URL này, sẽ cập nhật sau

```
CLOUDINARY_CLOUD_NAME = dxd7koqsl
```

```
CLOUDINARY_API_KEY = 679987377438153
```

```
CLOUDINARY_API_SECRET = 093eHF-oj8boUA7_vp_4yvfdUjo
```

## Bước 5.5: Deploy

1. Click **"Create Web Service"**

2. **Đợi 5-10 phút** để Render build và deploy

3. **Xem logs** để theo dõi tiến trình:
   ```
   Installing dependencies...
   Building...
   Starting server...
   Your service is live 🎉
   ```

4. **Lưu Backend URL:**
   ```
   https://dntu-buddies-backend.onrender.com
   ```

## Bước 5.6: Test Backend

Mở trình duyệt và truy cập:
```
https://dntu-buddies-backend.onrender.com/api/health
```

**Nếu thấy response** → Backend đã chạy thành công! ✅

---

# PHẦN 6: DEPLOY FRONTEND LÊN VERCEL

## Bước 6.1: Cập Nhật Environment Variables

1. Mở file `frontend/.env.production`

2. **Sửa API URL:**
   ```env
   # Production API URL
   VITE_API_URL=https://dntu-buddies-backend.onrender.com/api
   ```

3. **Lưu file**

## Bước 6.2: Commit Thay Đổi

```bash
# Tại thư mục gốc
git add frontend/.env.production
git commit -m "Update production API URL"
git push origin main
```

## Bước 6.3: Tạo Tài Khoản Vercel

1. Truy cập: https://vercel.com/signup

2. Click **"Continue with GitHub"**

3. **Authorize Vercel** truy cập GitHub

## Bước 6.4: Import Project

1. Trong Vercel Dashboard, click **"Add New..."** → **"Project"**

2. **Import Git Repository:**
   - Tìm repository: `dntu-buddies-team`
   - Click **"Import"**

## Bước 6.5: Cấu Hình Project

**Configure Project:**
- **Project Name:** `dntu-buddies-team`
- **Framework Preset:** Vite (tự động detect)
- **Root Directory:** Click **"Edit"** → Chọn `frontend`
- **Build Command:** `npm run build` (mặc định)
- **Output Directory:** `dist` (mặc định)
- **Install Command:** `npm install` (mặc định)

## Bước 6.6: Environment Variables

Click **"Environment Variables"**, thêm:

**Key:**
```
VITE_API_URL
```

**Value:**
```
https://dntu-buddies-backend.onrender.com/api
```

**Environment:** All (Production, Preview, Development)

## Bước 6.7: Deploy

1. Click **"Deploy"**

2. **Đợi 2-3 phút**

3. **Xem logs:**
   ```
   Installing dependencies...
   Building...
   Deploying...
   ✓ Deployment ready
   ```

4. **Lưu Frontend URL:**
   ```
   https://dntu-buddies-team.vercel.app
   ```

5. Click **"Visit"** để xem website

---

# PHẦN 7: CẬP NHẬT CORS

## Bước 7.1: Cập Nhật Backend Environment

1. Quay lại **Render Dashboard**

2. Click vào Web Service: `dntu-buddies-backend`

3. Click tab **"Environment"**

4. Tìm biến `FRONTEND_URL`

5. **Sửa giá trị:**
   ```
   https://dntu-buddies-team.vercel.app
   ```

6. Click **"Save Changes"**

7. Service sẽ tự động **redeploy** (đợi 2-3 phút)

---

# PHẦN 8: TEST TOÀN BỘ HỆ THỐNG

## Bước 8.1: Test Frontend

1. Truy cập: `https://dntu-buddies-team.vercel.app`

2. **Kiểm tra:**
   - ✅ Trang chủ hiển thị
   - ✅ Hiệu ứng 3D hoạt động
   - ✅ Chưa có members nào (vì chưa ai cập nhật avatar + role)
   - ✅ Hiển thị empty state

## Bước 8.2: Test Login Admin

1. Click **"Đăng nhập"**

2. **Đăng nhập:**
   - Email: `admin@dntubuddiesteam.com`
   - Password: `admin123`

3. **Kiểm tra:**
   - ✅ Đăng nhập thành công
   - ✅ Redirect về trang chủ
   - ✅ Hiển thị nút "Chỉnh sửa hồ sơ" và "Đăng xuất"

## Bước 8.3: Test Login Member

1. Đăng xuất admin

2. **Đăng nhập bằng 1 trong 36 tài khoản:**
   - Email: `dinhthihaianh@dntubuddiesteam.com`
   - Password: `dinhthihaianh123`

3. **Kiểm tra:**
   - ✅ Đăng nhập thành công

## Bước 8.4: Test Update Profile

1. Click **"Chỉnh sửa hồ sơ"**

2. **Cập nhật:**
   - Upload ảnh đại diện
   - Điền vị trí: `Member`
   - Điền các thông tin khác (optional)

3. Click **"Lưu"**

4. **Kiểm tra:**
   - ✅ Cập nhật thành công
   - ✅ Ảnh hiển thị đúng

5. **Quay lại trang chủ:**
   - ✅ Profile xuất hiện trên homepage! 🎉

## Bước 8.5: Test Member Detail

1. Click vào member card

2. **Kiểm tra:**
   - ✅ Hiển thị đầy đủ thông tin
   - ✅ Hiệu ứng 3D hoạt động
   - ✅ Tất cả fields hiển thị đúng

---

# PHẦN 9: GỬI THÔNG TIN CHO 36 THÀNH VIÊN

## Bước 9.1: Chuẩn Bị Danh Sách

Mở file `backend/scripts/members_credentials.csv` hoặc copy từ terminal khi chạy script.

## Bước 9.2: Template Email

```
Chào [Tên thành viên]!

🎉 Chào mừng bạn đến với DNTU Buddies Team!

Tài khoản website của bạn đã được tạo:
📧 Email: [email]
🔑 Mật khẩu: [password]

🌐 Truy cập website: https://dntu-buddies-team.vercel.app

📝 Hướng dẫn sử dụng:

1️⃣ ĐĂNG NHẬP
   - Vào: https://dntu-buddies-team.vercel.app/auth
   - Nhập email và mật khẩu trên

2️⃣ CẬP NHẬT PROFILE (BẮT BUỘC)
   - Click "Chỉnh sửa hồ sơ"
   - Upload ảnh đại diện
   - Điền vị trí trong CLB (VD: Member, International Relations, v.v.)
   - Điền đầy đủ thông tin khác:
     * Tên tiếng Anh
     * MSSV
     * Lớp
     * Ngày sinh
     * Quốc tịch
     * Ngành học
     * Năm học
     * Quote
     * Giới thiệu bản thân
     * Kỹ năng
     * Sở thích
     * Social links

3️⃣ LƯU VÀ KIỂM TRA
   - Click "Lưu"
   - Quay lại trang chủ
   - Profile của bạn sẽ xuất hiện! 🎉

⚠️ LƯU Ý QUAN TRỌNG:
- Vui lòng đổi mật khẩu ngay sau lần đăng nhập đầu tiên
- Phải có ảnh đại diện và vị trí thì mới xuất hiện trên trang chủ
- Cập nhật đầy đủ thông tin để profile đẹp hơn

Nếu có vấn đề gì, liên hệ admin nhé!

Best regards,
DNTU Buddies Team Admin
```

## Bước 9.3: Gửi Email/Message

**Cách 1: Gửi từng người (khuyến nghị)**
- Copy template
- Thay [Tên], [email], [password]
- Gửi qua Facebook Messenger, Zalo, Email, v.v.

**Cách 2: Gửi hàng loạt**
- Dùng Google Sheets + Mail Merge
- Hoặc dùng tool gửi email hàng loạt

---

# PHẦN 10: HOÀN TẤT & BẢO TRÌ

## ✅ Checklist Hoàn Thành

- [ ] MongoDB Atlas đã setup
- [ ] 36 tài khoản + admin đã migrate lên Atlas
- [ ] Code đã push lên GitHub
- [ ] Backend deployed trên Render
- [ ] Frontend deployed trên Vercel
- [ ] CORS đã cấu hình đúng
- [ ] Test login thành công
- [ ] Test upload ảnh thành công
- [ ] Test cập nhật profile thành công
- [ ] Đã gửi thông tin cho 36 thành viên
- [ ] Website hoạt động ổn định

## 🌐 Production URLs

**Frontend:** https://dntu-buddies-team.vercel.app
**Backend API:** https://dntu-buddies-backend.onrender.com/api
**Admin Login:** https://dntu-buddies-team.vercel.app/auth

**Admin Account:**
- Email: `admin@dntubuddiesteam.com`
- Password: `admin123`

## 📊 Monitoring

### Xem Logs

**Backend (Render):**
1. Vào Render Dashboard
2. Click service → Tab "Logs"
3. Xem real-time logs

**Frontend (Vercel):**
1. Vào Vercel Dashboard
2. Click project → Tab "Deployments"
3. Click deployment → "View Function Logs"

### Xem Analytics

**Vercel:**
- Tab "Analytics" → Xem traffic, performance

**Render:**
- Tab "Metrics" → Xem CPU, Memory usage

## 🔄 Update Code Sau Này

```bash
# Sửa code
# ...

# Commit và push
git add .
git commit -m "Update: [mô tả thay đổi]"
git push origin main

# Vercel và Render sẽ tự động deploy lại!
```

## 💾 Backup Database

**MongoDB Atlas:**
1. Vào Clusters → Click "..." → "Backup"
2. Enable "Cloud Backup" (Free tier có 1 snapshot)

**Manual Backup:**
```bash
# Export database
mongodump --uri="mongodb+srv://dntuadmin:password@cluster.mongodb.net/dntu-buddies-team" --out=./backup

# Import (nếu cần restore)
mongorestore --uri="mongodb+srv://dntuadmin:password@cluster.mongodb.net/dntu-buddies-team" ./backup/dntu-buddies-team
```

## 🆘 Troubleshooting

### Website chậm lần đầu truy cập
- Render free tier sleep sau 15 phút
- Đợi ~30s để service wake up
- Lần truy cập tiếp theo sẽ nhanh

### Lỗi CORS
- Kiểm tra `FRONTEND_URL` trong Render env
- Kiểm tra `VITE_API_URL` trong Vercel env
- Redeploy backend

### Upload ảnh không được
- Kiểm tra Cloudinary credentials
- Kiểm tra file size (max 10MB)

### Members không xuất hiện trên homepage
- Kiểm tra member đã có avatar và role chưa
- Kiểm tra `isActive = true`

---

# 🎉 CHÚC MỪNG!

Website DNTU Buddies Team đã sẵn sàng sử dụng! 🚀

**Các bước tiếp theo:**
1. ✅ Gửi thông tin đăng nhập cho 36 thành viên
2. ✅ Hướng dẫn họ cập nhật profile
3. ✅ Theo dõi và hỗ trợ khi cần
4. ✅ Tận hưởng website xịn xò với hiệu ứng 3D! 💙

Chúc CLB hoạt động hiệu quả!
