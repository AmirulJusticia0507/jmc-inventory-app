# JMC Inventory App - Fullstack Technical Test

## 🔗 Live Demo

- **Frontend (Vercel)**: https://jmc-inventory-app-mu.vercel.app
- **Backend API (Railway)**: https://jmc-inventory-api.railway.app
- **Swagger Docs**: https://jmc-inventory-api.railway.app/docs
- **Video Demo**: [youtu.be/pJXGr-ItO70](https://youtu.be/pJXGr-ItO70)

## 🛠 Tech Stack

- **Frontend**: Vue 3 + Vite + Pinia + Tailwind CSS
- **Backend**: NestJS + Prisma ORM
- **Database**: PostgreSQL (Neon)
- **Auth**: JWT + RBAC (Admin/Operator)

## 🚀 Quick Start (Local)

```bash
# Clone
git clone https://github.com/AmirulJusticia0507/jmc-inventory-app.git
cd jmc-inventory-app

# Backend
cd backend
cp .env.example .env
# Edit .env with your DATABASE_URL
npm install
npx prisma migrate dev
npm run prisma:seed
npm run start:dev

# Frontend (new terminal)
cd ../frontend
npm install
npm run dev
```

## 🐳 Docker (Production)

```bash
# Copy env and edit DATABASE_URL for Neon
cp .env.production.example .env.production

# Deploy
docker-compose --env-file .env.production up -d
```

## 👤 Test Accounts

| Role     | Username      | Password        |
| -------- | ------------- | --------------- |
| Admin    | `admin`     | `password123` |
| Operator | `operator1` | `password123` |

## ✨ Features

- **Authentication**: JWT login, role-based access, account locking
- **Categories/Sub-Categories**: CRUD with code (max 10 chars) & price limits
- **Incoming Goods**: Create/Edit with dynamic items, grand total validation vs price_limit
- **Operator Lock**: Auto-sets operator_id from JWT for Operator role
- **Verification**: Toggle verified status (green check icon)
- **Export**: Excel export with filters
- **Print**: Surat Masuk print page
- **File Upload**: Multer for attachments (PDF, images, docs)
- **Pagination/Search/Filter/Sort**: On all list pages

## 📁 Project Structure

```
jmc-inventory-app/
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── modules/        # Auth, Users, Categories, SubCategories, IncomingGoods, Upload
│   │   ├── common/         # Guards, Decorators, Pipes
│   │   └── prisma/         # Prisma service
│   ├── prisma/
│   │   ├── schema.prisma   # 5 models: User, Category, SubCategory, IncomingGood, IncomingGoodItem
│   │   ├── seed.js         # Automotive seed data
│   │   └── create-admin.js # Admin user creation
│   ├── Dockerfile
│   └── package.json
├── frontend/                # Vue 3 + Vite
│   ├── src/
│   │   ├── views/          # Pages
│   │   ├── components/     # UI components
│   │   ├── stores/         # Pinia stores
│   │   ├── services/       # Axios API
│   │   └── router/         # Vue Router + guards
│   ├── nginx.conf          # Nginx config for Docker
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml       # Full stack with PostgreSQL
├── Dockerfile               # Combined build
├── vercel.json             # Vercel config for frontend
└── .env.production.example # Production env template
```

## 🌐 Deployment Guide

### 1. Database (Neon)

1. Create project at https://neon.tech
2. Copy connection string → `DATABASE_URL`

### 2. Backend (Railway)

1. Connect GitHub repo
2. Add PostgreSQL service or use Neon `DATABASE_URL`
3. Set env vars:
   ```
   DATABASE_URL=postgresql://...
   JWT_SECRET=your-secret-32-chars
   PORT=3001
   NODE_ENV=production
   APP_URL=https://your-backend.railway.app
   ```
4. Deploy → runs `prisma migrate deploy` automatically

### 3. Frontend (Vercel)

1. Import GitHub repo
2. Set Root Directory: `frontend`
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Env Var: `VITE_API_URL=https://your-backend.railway.app/api`
6. Deploy

### 4. CORS (Backend)

Update `main.ts` for production:

```typescript
app.enableCors({
  origin: ['https://jmc-inventory-app-mu.vercel.app'],
  credentials: true,
});
```

## 📝 API Endpoints

| Method | Endpoint                           | Description         |
| ------ | ---------------------------------- | ------------------- |
| POST   | `/api/auth/login`                | Login               |
| GET    | `/api/auth/me`                   | Current user        |
| GET    | `/api/categories`                | List categories     |
| POST   | `/api/categories`                | Create (Admin)      |
| GET    | `/api/sub-categories`            | List sub-categories |
| POST   | `/api/sub-categories`            | Create (Admin)      |
| GET    | `/api/users`                     | List users (Admin)  |
| GET    | `/api/incoming-goods`            | Paginated list      |
| POST   | `/api/incoming-goods`            | Create              |
| PATCH  | `/api/incoming-goods/:id/verify` | Toggle verified     |
| GET    | `/api/incoming-goods/export`     | Excel export        |
| POST   | `/api/upload`                    | File upload         |

## 📄 License

MIT
