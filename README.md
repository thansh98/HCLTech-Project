# GreenGrid — Enterprise Energy & Sustainability Platform

GreenGrid is a production-ready, modular full-stack energy monitoring, billing, and sustainability management system built with **React 19** on the frontend and **Django + Django REST Framework** on the backend.

---

## Architecture Overview

```text
greengrid/
├── frontend/             # React 19 + Vite + Tailwind CSS + Chart.js
│   ├── public/
│   ├── src/
│   │   ├── app/          # App root, router, providers
│   │   ├── components/   # Common atomic UI, layout, chart components
│   │   ├── features/     # Feature-driven modules (auth, meters, readings, etc.)
│   │   ├── hooks/        # Custom React hooks
│   │   ├── services/     # Centralized Axios API & auth storage
│   │   ├── utils/        # Formatters & utilities
│   │   └── constants/    # Routes, roles, API endpoints
│   ├── .env
│   └── vite.config.js
│
├── backend/              # Django 6 + Django REST Framework
│   ├── manage.py
│   ├── config/
│   │   ├── settings/     # Split settings (base, development, production)
│   │   ├── urls.py
│   │   ├── asgi.py
│   │   └── wsgi.py
│   ├── apps/             # Domain apps (accounts, facilities, energy, etc.)
│   ├── common/           # Shared permissions, pagination, exception handlers
│   └── requirements.txt
│
├── README.md
└── .gitignore
```

---

## Quickstart Guide

### 1. Backend Setup

```bash
cd backend

# Create & activate Python virtual environment (if not already created)
python -m venv ../venv
# On Windows:
..\venv\Scripts\activate
# On Linux/macOS:
source ../venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
python manage.py makemigrations
python manage.py migrate

# Seed sample data (admin user, facilities, meters, readings, bills, alerts)
python manage.py seed_data

# Start the Django development server
python manage.py runserver 8000
```

- Default Admin Account:
  - **Username**: `admin`
  - **Password**: `admin123`

### 2. Frontend Setup

```bash
cd frontend

# Install npm dependencies
npm install

# Start Vite development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## API Endpoints

- Authentication: `/api/auth/login/`, `/api/auth/register/`, `/api/auth/refresh/`, `/api/auth/me/`
- User Management: `/api/users/`
- Facilities: `/api/facilities/`
- Meters: `/api/meters/`
- Energy Readings: `/api/energy/`, `/api/energy/import-csv/`
- Analytics: `/api/analytics/summary/`, `/api/analytics/trends/`, `/api/analytics/dashboard/`
- Billing: `/api/billing/`
- Renewables: `/api/renewables/`, `/api/renewables/breakdown/`
- Alerts: `/api/alerts/history/`, `/api/alerts/thresholds/`, `/api/alerts/history/<id>/acknowledge/`, `/api/alerts/history/<id>/resolve/`
- Reports: `/api/reports/export/readings/`, `/api/reports/summary/`
- Audit Logs: `/api/audit/`
