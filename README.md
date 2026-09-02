# Instant Mechanic - Live Vehicle Service Operations Dashboard

**Candidate Name:** Aarti Goyal  
**Live Frontend (Vercel):** https://frontend-seven-sand-95.vercel.app/  
**Live Backend API (AWS):** https://13.53.39.15/api/  
**Interactive API Documentation (Swagger UI):** https://13.53.39.15/api/docs/  

---

> 💡 **Note for Evaluators:**  
> The backend is deployed on AWS EC2 with HTTPS (`https://13.53.39.15/api/`). Because it uses a self-signed SSL certificate:  
> **Before testing the live Vercel frontend in your browser, please visit [https://13.53.39.15/api/docs/](https://13.53.39.15/api/docs/) once and click "Advanced -> Proceed to 13.53.39.15 (unsafe)" to allow your browser to connect to the live AWS backend.**  
>  
> **Demo Credentials:**  
> - **Username:** `testuser123`  
> - **Password:** `password123`  
> *(You can also register a new operations or admin account directly on the dashboard!)*  

---

## 🚀 Project Overview

This project is a modern, production-grade **Live Vehicle Service Operations Dashboard** engineered for **Instant Mechanic**. It empowers the operations team to monitor business KPIs, track active mechanics, manage customer bookings, and analyze revenue trends in real-time.

The solution is built with a decoupled architecture (Next.js on Vercel, Django REST Framework on AWS EC2, and PostgreSQL in Docker), adhering to production SaaS standards for UI/UX, security, database design, and containerized deployment.

---

## 🛠️ Tech Stack

* **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, shadcn/ui, Recharts, Lucide React, NextAuth.js
* **Backend:** Python 3.12, Django 6, Django REST Framework (DRF), SimpleJWT, drf-spectacular (OpenAPI 3.0)
* **Database:** PostgreSQL 15 (Containerized with healthchecks)
* **Infrastructure & Containerization:** Docker, Docker Compose, Nginx (Reverse Proxy + SSL), AWS EC2, Vercel

---

## 🏗️ Architecture

The application follows a decoupled microservices architecture:

```
┌───────────────────────────────┐
│     Next.js Frontend          │  (Vercel - Serverless Deployment)
│  (NextAuth, Tailwind, UI)     │
└──────────────┬────────────────┘
               │
               │ HTTPS / JSON REST APIs
               ▼
┌───────────────────────────────┐
│       Nginx Reverse Proxy     │  (AWS EC2 Container)
└──────────────┬────────────────┘
               │
               ▼
┌───────────────────────────────┐
│   Django REST Framework API   │  (AWS EC2 Container - Gunicorn/Django)
└──────────────┬────────────────┘
               │
               │ PostgreSQL Protocol (Port 5432)
               ▼
┌───────────────────────────────┐
│     PostgreSQL Database       │  (AWS EC2 Container - Persistent Volume)
└───────────────────────────────┘
```

1. **Frontend (Client/Vercel):** A Next.js App Router application providing a responsive operations dashboard. Features real-time metric cards, interactive charts, sortable/filterable booking tables, and seamless registration/login flows.
2. **Backend (API/AWS EC2):** Django REST Framework serving clean, optimized REST endpoints with SimpleJWT authentication and OpenAPI swagger documentation.
3. **Database (PostgreSQL/AWS EC2):** PostgreSQL database storing relational models for Customers, Mechanics, and Bookings with 500+ realistic seeded records.

---

## 💻 Local Setup Instructions

### Option 1: Quick Start with Docker (Recommended)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AartiGoyal16/vehicleServiceDashboard.git
   cd vehicleServiceDashboard
   ```

2. **Start the application with Docker Compose:**
   ```bash
   docker-compose up -d --build
   ```

3. **Run database migrations and seed 500+ realistic records:**
   ```bash
   docker-compose exec backend python manage.py migrate
   docker-compose exec backend python seed.py
   ```

4. **Access the application locally:**
   * **Frontend Dashboard:** `http://localhost:3000`
   * **Backend API Root:** `http://localhost:8000/api/`
   * **Swagger API Docs:** `http://localhost:8000/api/docs/`

---

### Option 2: Manual Setup

#### Backend Setup:
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python seed.py
python manage.py runserver 0.0.0.0:8000
```

#### Frontend Setup:
```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Environment Variables

### Root / Docker Compose (`.env`):
```env
DB_NAME=vehicleservice
DB_USER=postgres
DB_PASSWORD=AartiGoyal
DB_HOST=db
DB_PORT=5432
SECRET_KEY=django-insecure-prod-key
DEBUG=True
ALLOWED_HOSTS=*
NEXT_PUBLIC_API_URL=https://13.53.39.15
API_URL=https://13.53.39.15
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=my_super_secret_development_key_123
```

### Frontend (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=https://13.53.39.15
API_URL=https://13.53.39.15
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=my_super_secret_development_key_123
```

---

## 📚 API Documentation

Interactive Swagger documentation is auto-generated via `drf-spectacular` at `/api/docs/`.

### Key Endpoints:

* `POST /api/register/` - Create a new operations/admin account.
* `POST /api/token/` - Obtain JWT access token & refresh token.
* `GET /api/dashboard/` - Returns overview KPI metrics, formatted chart time-series data, and active mechanics status.
* `GET /api/bookings/` - Returns paginated, searchable, sortable, and filterable booking records.
* `GET /api/bookings/:id/` - Detailed view of a single booking.
* `GET /api/mechanics/` - List of all mechanics and their current job assignments.
* `GET /api/customers/` - List of registered customers.

---

## ☁️ Deployment Details

* **Frontend:** Deployed to **Vercel** with Next.js App Router, environment variables, and automatic GitHub CI/CD integration.
* **Backend & Database:** Deployed on **AWS EC2 (Ubuntu)** using **Docker & Docker Compose** running Nginx, Django (Gunicorn), and PostgreSQL containers behind an SSL proxy.

---

## 🤖 AI Usage Disclosure

AI tools were used strategically as an engineering multiplier:

* **AI Tools Used:** Antigravity / Gemini / Claude
* **What AI was used for:**
  - Generating initial Django REST Framework ViewSets and serializers.
  - Formulating the database seeding script (`seed.py`) to generate 500+ realistic vehicle service bookings, customer names, mechanic profiles, and status progressions.
  - Designing responsive Tailwind CSS layout cards and Recharts analytics components.
  - Writing Docker Compose environment mapping configurations.
* **Personal Implementation & Modification:**
  - Designed the overall microservices architecture (Vercel frontend + AWS EC2 PostgreSQL/Django backend).
  - Architected the NextAuth credentials provider to bridge Next.js sessions with Django SimpleJWT tokens.
  - Configured CORS, allowed origins, and self-signed TLS handling for cross-domain requests.
  - Optimized Django ORM aggregations (`Sum`, `Count`) in `dashboard_stats` to minimize client payload sizes.

---

## ⭐ What I Am Most Proud Of

I am particularly proud of the **end-to-end production architecture**. Migrating the application from local SQLite to a containerized **PostgreSQL** database on AWS EC2 while maintaining real-time communication with the Next.js frontend on Vercel presented real engineering challenges (CORS, SSL certificate verification in serverless functions, environment sync). Resolving these to deliver a smooth, high-performance operations dashboard that handles 500+ records seamlessly was an extremely rewarding engineering accomplishment.