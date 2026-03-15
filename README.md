# 🗺️ Vision — Community Incident Reporting

> Real-time, community-driven incident reporting platform. Built in 24 hours for a hackathon.

---

## What It Does

Vision lets anyone report incidents happening around them — accidents, floods, hazards, crime — and pins them live on a shared map. Every connected user sees new reports appear instantly with no refresh required.

---

## Features

- 🔴 **Real-time map** — Incidents appear live on all connected clients via WebSockets
- 📍 **Click-to-report** — Click any location on the map to file a report
- 🖼️ **Photo uploads** — Attach images stored in Supabase Storage
- 🔎 **Filter by type** — Toggle between accident, flood, hazard, crime, and other
- ⚡ **Auto-expiry** — Reports automatically deactivate after 6 hours via pg_cron
- 🔐 **JWT Auth** — Access + refresh token system with httpOnly cookies

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vanilla HTML, CSS, JavaScript |
| Map | Leaflet.js |
| Backend | Node.js + Express |
| Real-Time | Socket.io |
| Database | PostgreSQL (Supabase) |
| Auth | JWT (Access + Refresh Tokens) |
| File Storage | Supabase Storage |
| Hosting | Railway |

---

## Getting Started

### Prerequisites

- Node.js v18+
- A [Supabase](https://supabase.com) project

### Installation

```bash
git clone https://github.com/your-username/vision.git
cd vision
npm install
```

### Environment Variables

Create a `.env` file in the root:

```env
PORT=5000
FRONTEND_URL=http://localhost:5000

DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres

ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

SUPABASE_URL=https://[PROJECT-REF].supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key
```

### Database Setup

Run migrations:

```bash
npm run migrate up
```

### Run Locally

```bash
npm run dev
```

Visit `http://localhost:5000`

---

## Project Structure

```
vision/
├── public/                 # Static frontend
│   ├── index.html          # Landing page
│   ├── login.html          # Login page
│   ├── register.html       # Register page
│   ├── map.html            # Main map page
│   ├── css/
│   │   ├── global.css      # Shared styles, variables, theme
│   │   ├── index.css       # Landing page styles
│   │   ├── auth.css        # Login / register styles
│   │   └── map.css         # Map page styles
│   └── js/
│       ├── auth.js         # Login / register logic
│       └── map.js          # Map, markers, real-time events
├── config/
│   ├── postgres.js         # PostgreSQL pool
│   ├── supabase.js         # Supabase client
│   └── multer.js           # File upload config
├── controllers/
│   ├── authControllers.js  # Registration, login, refresh
│   └── incidentControllers.js
├── middleware/
│   └── authenticateAccessToken.js
├── routes/
│   ├── auth.js
│   └── incidents.js
├── util/
│   ├── generateAccessToken.js
│   └── generateRefreshToken.js
├── database/
│   └── migrations/
├── server.js
└── .env
```

---

## API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register a new user |
| POST | `/api/auth/login` | No | Login and receive tokens |

### Incidents
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/incidents` | No | Fetch all active incidents |
| POST | `/api/incidents` | Yes | Submit a new incident |
| POST | `/api/incidents/:id/upvote` | Yes | Upvote an incident |

---

## Real-Time Flow

1. User submits a report via the form
2. Backend saves it to Supabase
3. Backend emits a `new_incident` event via Socket.io
4. All connected clients receive the event
5. New marker appears on every map instantly

---

## Database Schema

### users
| Column | Type |
|--------|------|
| id | UUID |
| email | TEXT |
| username | TEXT |
| password | TEXT (hashed) |
| created_at | TIMESTAMPTZ |

### incidents
| Column | Type |
|--------|------|
| id | UUID |
| user_id | UUID (FK) |
| type | TEXT |
| description | TEXT |
| latitude | FLOAT |
| longitude | FLOAT |
| photo_url | TEXT |
| severity | TEXT |
| is_active | BOOLEAN |
| upvote_count | INTEGER |
| expires_at | TIMESTAMPTZ |
| created_at | TIMESTAMPTZ |

### tokens
| Column | Type |
|--------|------|
| id | UUID |
| user_id | UUID (FK) |
| token | TEXT (SHA-256 hash) |
| expires_at | TIMESTAMPTZ |
| created_at | TIMESTAMPTZ |

---

## Deployment

The app is deployed as a single service on **Railway**. The Express server handles both the API and static file serving.

Set all environment variables in Railway's Variables tab before deploying.

---

## Future Features

- Push notifications for nearby incidents
- Native mobile app (React Native)
- AI duplicate detection
- Heatmap view
- Moderator dashboard
- Emergency services API integration

---

*Built in 24 hours at a hackathon. Keeping Jamaica safe, one report at a time.*
