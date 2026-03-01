# SecureCare Healthcare Access Platform
A complete, production-ready, full-stack healthcare security web application engineered with a "Zero-Trust" architectural mindset. SecureCare provides clinical professionals and patients secure, RBAC-gated access to medical records while empowering administrators with live threat intelligence and audit trails.

## 🚀 Features

### Robust Security Architecture
- **Zero-Trust Enforcement**: All API requests are verified using strict, short-lived JWTs (JSON Web Tokens) with a robust refresh-token rotation system.
- **Role-Based Access Control (RBAC)**: Enforced at both the middleware and database level.
    - **Admin**: Approve/reject pending users, view security alerts, monitor audit trails.
    - **Doctor**: View assigned patients, prescribe medication, upload lab reports.
    - **Patient**: Access personal medical records, active prescriptions, and lab results.
- **Admin Authorization Approval**: Newly registered clinical staff and patients are placed in a `PENDING` state and require manual approval by an Administrator before gaining system access.
- **Comprehensive Audit Trail**: Security ledger actions (logins, approvals, rejections, clinical data reads/writes) are permanently logged in PostgreSQL.
- **Live Threat Detection**: Anomaly logs and simulated security alerts monitor the system for suspicious behavior (e.g., unauthorized access attempts, credential stuffing).

### Modern Technology Stack
- **Frontend**: Next.js 14, React, TailwindCSS (with custom Glassmorphism UI tokens), Lucide Icons.
- **Backend**: Node.js, Express.js (Modular Router Architecture).
- **Database**: PostgreSQL with Prisma ORM (v7.4.2).
- **Authentication**: bcrypt password hashing, jsonwebtoken (JWT).
- **Caching**: Redis (used for JWT blacklisting).

## 📂 Project Structure

SecureCare is organized as a monorepo containing both the frontend and backend.

```
SecureCare/
├── backend/                  # Node.js + Express API
│   ├── prisma/               # Database schemas & seed scripts
│   ├── src/                  
│   │   ├── controllers/      # Route logic (admin, doctor, patient, auth)
│   │   ├── middlewares/      # RBAC, Auth verification, Error handling
│   │   ├── routes/           # API Endpoints
│   │   ├── services/         # Business logic (Audit logs, Auth services)
│   │   └── utils/            # Prisma client, token generation, loggers
│   └── .env                  # Backend Configuration (DB URL, Secrets)
│
└── frontend/                 # Next.js Application
    ├── public/               
    ├── src/
    │   ├── app/              # Next.js App Router (Pages & Layouts)
    │   ├── components/       # Reusable UI (Navbar, Sidebar, Modals)
    │   ├── context/          # React Context (AuthContext)
    │   └── lib/              # Axios API clients
    └── tailwind.config.ts    # Custom Design Tokens
```

## 🛠️ Local Development Setup

### Prerequisites
- Node.js (v20+)
- PostgreSQL Server (Running locally or via Docker)
- Redis Server (Running locally or via Docker)

### 1. Database Configuration
Ensure your PostgreSQL server is running. Create a new database to host SecureCare.

In `backend/.env`, set your connection strings and secrets:
```env
# Database Connections
DATABASE_URL="postgresql://username:password@localhost:5432/securecare?schema=public"
REDIS_URL="redis://localhost:6379"

# Security Secrets (Generate secure random strings for these in production)
JWT_USER_ACCESS_SECRET="your-user-access-secret"
JWT_USER_REFRESH_SECRET="your-user-refresh-secret"
JWT_ADMIN_ACCESS_SECRET="your-admin-access-secret"
JWT_ADMIN_REFRESH_SECRET="your-admin-refresh-secret"
PORT=3001
```

### 2. Backend Installation & Seeding
Navigate to the `backend` directory, install dependencies, map the Prisma schema to your database, and seed the initial users:

```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
npx tsx prisma/seed-anomalies.ts
```

### 3. Frontend Installation
In a separate terminal, navigate to the `frontend` directory:

```bash
cd frontend
npm install
```

In `frontend/.env.local`, set the API URL:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 4. Running the Application
Start both the backend server and frontend development server:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

Visit `http://localhost:3000` to access the SecureCare platform.

## 🔐 Default Seeded Credentials

The `prisma/seed.ts` script populates the database with the following active accounts for ease of testing:

| Role | Login Portal | Email | Password |
| :--- | :--- | :--- | :--- |
| **System Admin** | `/admin/login` | `admin@securecare.local` | `AdminSecurePassword123!` |
| **Doctor** | `/login` | `` | `` |
| **Patient** | `/login` | `` | `` |

## 🎨 UI & Design Philosophy
The frontend emphasizes a "Glassmorphism" aesthetic characterized by dark backgrounds, vibrant blue/emerald accent glows, translucent panels, and sleek backdrop-blur effects. This design evokes the feeling of interacting with a highly secure, state-of-the-art security terminal while remaining accessible and functional for daily clinical use.

## 📝 License
This project is for demonstration purposes. Do not use default credentials in a production environment.
