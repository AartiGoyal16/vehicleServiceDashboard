# Instant Mechanic - Live Operations Dashboard

**Candidate Name:** Aarti Goyal
**Live Frontend (Vercel):** [Insert Vercel Link Here]
**Live Backend API (AWS):** http://13.53.39.15:8000/api/dashboard/
**Interactive API Docs:** http://13.53.39.15:8000/api/docs/

## Project Overview
This project is a Live Vehicle Service Operations Dashboard built for the operations team at Instant Mechanic. It provides a real-time, comprehensive view of business KPIs, mechanic availability, and customer service requests. The goal was to engineer a production-ready internal tool prioritizing modern UI/UX, robust security, and scalable architecture.

## Tech Stack
* **Frontend:** Next.js (React), TypeScript, Tailwind CSS, shadcn/ui, Recharts
* **Backend:** Python, Django REST Framework, SimpleJWT
* **Database:** SQLite (Configured for easy local testing & evaluation)
* **Infrastructure:** Docker, Docker Compose, Vercel, AWS EC2

## Architecture
The application follows a decoupled microservices architecture:
1. **Frontend (Client):** A Next.js application that handles UI rendering, state management, and JWT-based authentication via NextAuth.
2. **API Gateway/Routing:** RESTful communication over HTTP, with global `IsAuthenticated` locks on protected routes.
3. **Backend (Server):** Django REST Framework processes business logic, handles complex database aggregations for the analytics, and auto-generates OpenAPI documentation.
4. **Database:** Relational data storage utilizing Django's ORM for efficient querying of bookings, customers, and mechanics.

## Local Setup

### Option 1: Using Docker (Recommended)
Make sure Docker Desktop is installed and running.
1. Clone the repository: `git clone <your-repo-link>`
2. Navigate to the root directory.
3. Run the application: 
   ```bash
   docker-compose up --build
   ```
4. While the server is running, open a new terminal window to seed the database with 500+ realistic records:
   ```bash
   docker-compose exec backend python seed.py
   ```
5. Access the live dashboard at `http://localhost:3000` and the API docs at `http://localhost:8000/api/docs/`.

### Option 2: Manual Setup
**Backend:**
1. Navigate to the backend directory: `cd backend`
2. Create a virtual environment: `python -m venv venv`
3. Activate the environment: `source venv/bin/activate` (Mac/Linux) or `.\venv\Scripts\activate` (Windows)
4. Install dependencies: `pip install -r requirements.txt`
5. Run migrations: `python manage.py migrate`
6. Seed the database: `python seed.py`
7. Start the server: `python manage.py runserver`

**Frontend:**
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

## Environment Variables
If running manually without Docker, create `.env` files in their respective directories.

**Frontend (`frontend/.env`):**
```text
NEXT_PUBLIC_API_URL=[http://127.0.0.1:8000](http://127.0.0.1:8000)
NEXTAUTH_SECRET=your_super_secret_key
NEXTAUTH_URL=http://localhost:3000
```

**Backend (`backend/.env`):**
```text
DEBUG=True
SECRET_KEY=django_secret_key
```

## API Documentation
The backend utilizes `drf-spectacular` to automatically generate Swagger OpenAPI documentation. Once the backend server is running, navigate to `/api/docs/` to interactively view and test all endpoints.

**Major Endpoints:**
* `POST /api/register/` - Create a new operations/admin account.
* `POST /api/token/` - Obtain JWT access and refresh tokens.
* `GET /api/dashboard/` - Returns pre-calculated aggregations for the 8 core KPIs, formatted chart data arrays, and current mechanics status.
* `GET /api/bookings/` - Returns paginated, sortable, and filterable booking records.

## Deployment
* **Frontend:** Deployed as a serverless Next.js application on Vercel with environment variables linked to the live backend URL.
* **Backend:** Containerized using Docker and deployed to an AWS EC2 Free Tier instance.

## AI Usage
AI tools were utilized as an engineering multiplier throughout this project:
* **Gemini:** Served as a pair-programming assistant to help scaffold the initial Django REST Framework ViewSets, configure the JWT authentication pipeline, resolve strict TypeScript compiler issues, and write the Python script to seed the database with realistic test data.
* **Personal Implementation:** I took full ownership of the system architecture, designing the relational database models, implementing the custom React hooks for state management, formatting the API response structures to minimize frontend processing load, and heavily fine-tuning the shadcn/ui and Recharts components to achieve a highly polished, responsive user experience.

## What I am Most Proud Of
I am particularly proud of the data pipeline between the Django backend and the Next.js frontend. Instead of sending raw database rows and forcing the client browser to calculate metrics, the backend efficiently uses Django ORM aggregations (`Sum`, `Count`) to calculate the KPIs and format the time-series data. This significantly reduces the API payload size and ensures the dashboard remains incredibly fast and responsive, even when analyzing thousands of records. Containerizing the entire full-stack application with Docker for seamless deployment was also a highly rewarding engineering milestone.