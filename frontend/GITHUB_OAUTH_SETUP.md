# การตั้งค่า GitHub OAuth สำหรับ Community Board

## ขั้นตอนการตั้งค่า

### 1. สร้าง GitHub OAuth App

1. ไปที่ [GitHub Developer Settings](https://github.com/settings/developers)
2. คลิก **"OAuth Apps"** > **"New OAuth App"**
3. กรอกข้อมูลดังนี้:
   - **Application name:** `Open-Vote Local Dev` (หรือชื่อที่คุณต้องการ)
   - **Homepage URL:** `http://localhost:3000`
   - **Authorization callback URL:** `http://localhost:3000/api/auth/callback/github`
4. คลิก **"Register application"**
5. คัดลอก **Client ID**
6. คลิก **"Generate a new client secret"** และคัดลอก **Client Secret**

### 2. ตั้งค่า Environment Variables

1. สร้างไฟล์ `.env.local` ในโฟลเดอร์ `frontend/`:

```bash
cp .env.local.example .env.local
```

2. แก้ไขไฟล์ `.env.local` และใส่ค่าที่ได้จาก GitHub:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-change-this-in-production

GITHUB_ID=your_github_client_id_here
GITHUB_SECRET=your_github_client_secret_here
```

3. สร้าง `NEXTAUTH_SECRET` แบบสุ่ม:

```bash
openssl rand -base64 32
```

### 3. รีสตาร์ท Development Server

```bash
npm run dev
```

## การใช้งาน

1. เปิดเว็บไซต์ที่ `http://localhost:3000`
2. ไปที่ส่วน **"เสวนาประชาธิปไตย"** (Community Hub)
3. คลิก **"เข้าสู่ระบบด้วย GitHub"**
4. อนุญาตให้แอปเข้าถึงข้อมูล GitHub ของคุณ
5. เริ่มโพสต์และแสดงความคิดเห็นได้เลย!

## Features

- ✅ เข้าสู่ระบบด้วย GitHub OAuth
- ✅ โพสต์ข้อความ (ต้องเข้าสู่ระบบ)
- ✅ ลบโพสต์ของตัวเอง
- ✅ แสดงรูปโปรไฟล์จาก GitHub
- ✅ อัพเดทโพสต์แบบเรียลไทม์ (ทุก 10 วินาที)
- ✅ เก็บข้อมูลในไฟล์ JSON (สำหรับ demo)

## Production Deployment

สำหรับ Production บน Vercel:

1. ไปที่ Vercel Dashboard > Settings > Environment Variables
2. เพิ่ม Environment Variables:
   - `NEXTAUTH_URL` = `https://your-domain.vercel.app`
   - `NEXTAUTH_SECRET` = (สร้างใหม่ด้วย `openssl rand -base64 32`)
   - `GITHUB_ID` = (สร้าง OAuth App ใหม่สำหรับ Production)
   - `GITHUB_SECRET` = (จาก OAuth App ใหม่)

3. สร้าง GitHub OAuth App ใหม่สำหรับ Production:
   - **Homepage URL:** `https://your-domain.vercel.app`
   - **Callback URL:** `https://your-domain.vercel.app/api/auth/callback/github`

## Database Migration (Optional)

ในอนาคตสามารถเปลี่ยนจาก JSON file เป็น Database ได้:
- PostgreSQL (Vercel Postgres)
- MongoDB (MongoDB Atlas)
- Supabase
- PlanetScale

แก้ไขไฟล์ `/app/api/community/posts/route.ts` เพื่อเชื่อมต่อกับ Database
