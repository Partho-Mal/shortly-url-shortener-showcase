# Shortly URL Shortener - Showcase Edition

> This repository contains the **frontend (Next.js)** and **backend (Go)** of the Shortly URL Shortener demo application.  
> The full production build with advanced features is deployed at:
>
> 🔗 <a href="https://shortly.streamlab.in" target="_blank" rel="noopener noreferrer">
> https://shortly.streamlab.in
> </a>
>
> This public version is intentionally lighter and is structured to showcase code quality, engineering approach, and architectural decisions for review.

---

## 📁 Monorepo Structure

```bash
shortly-url-shortener-showcase/
├── go_backend/               # Go API server
│   ├── cmd/                  # Server entrypoint
│   ├── internal/             # Handlers, services, middleware, utils
│   ├── router/               # Route mapping
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── SHORTLY_BACKEND_ENV_SETUP.md
│   └── README.md
│
└── next-frontend/            # Next.js (App Router + TypeScript)
    ├── app/                  # Pages, dashboard, auth, routing
    ├── components/           # UI + logic components
    ├── hooks/                # React Hooks
    ├── utils/                # API + helpers
    ├── public/               # Static assets
    ├── proxy.ts
    ├── README.md
    └── .env.example
```

---

## 🏗️ Architecture Overview

Shortly is built using a **service‑based monorepo**:

| Layer           | Technology                   | Purpose                                                   |
| --------------- | ---------------------------- | --------------------------------------------------------- |
| Frontend        | Next.js + React + TypeScript | UI, routing, dashboards, public landing, URL shortening   |
| Backend         | Go, Gin                      | URL shortening, auth, QR generation, database interaction |
| Database        | PostgreSQL                   | Persistent storage for users + shortened URLs             |
| Cache/Analytics | Redis                        | Click tracking, rate limiting                             |

---

## 🔧 Tech Stack

### ✅ Backend

* Go 1.25+
* Gin Web Framework
* Redis
* PostgreSQL
* JWT Auth + Cookies
* Google OAuth
* Distroless Runtime (secure container)

### ✅ Frontend

* Next.js 16 (App Router)
* React + TypeScript
* Tailwind CSS
* ShadCN UI
* Sonner (Toast notifications)
* `apiFetch` wrapper with:

  * rate-limit handling
  * uniform error handling

---

## ✅ Core Features

### URL Shortening

* Custom + auto slug
* Click tracking
* Copy/share action

### QR Code Generation

* Auto or customizable
* Download options

### Auth

* Google OAuth
* JWT session tokens

### Dashboard

* List + copy + delete links
* Visit stats
* Last clicked time

### Theming

* Dark / light mode

### Rate Limiting

* Per user / IP

---

## 🚀 Quick Start

Clone repository:

```bash
git clone https://github.com/Partho-Mal/shortly-url-shortener-showcase.git
cd shortly-url-shortener-showcase
```

---

# ▶️ Backend Setup: `go_backend`

### Install dependencies

```bash
cd go_backend
go mod download
```

### Configure environment

Copy example:

```bash
cp .env.example .env
```

Provide Google OAuth + DB credentials.

### Start PostgreSQL + Redis (Docker)

```bash
docker compose up -d
```

### Run backend

```bash
go run ./cmd/server
```

Backend runs at:

```
http://localhost:8080
```

API base:

```
http://localhost:8080/api
```

More details → `go_backend/README.md`

---

# 💻 Frontend Setup: `next-frontend`

### Install dependencies

```bash
cd ../next-frontend
npm install
```

### Configure env

```bash
cp .env.example .env.local
```

Add backend API values, Google OAuth redirect, etc.

### Start dev server

```bash
npm run dev
```

Frontend runs at:

```
http://localhost:3000
```

More details → `next-frontend/README.md`

---

## 🔐 Authentication

Shortly uses **Google OAuth + JWT cookies**.

Add these to environment:

```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:8080/google/callback
```

---

## 🧱 Database Schema

See `db.md` or backend README for full SQL.

> Key tables: `users`, `urls`, `url_visits`, `user_subscriptions`

Includes sync triggers + plan inheritance.

---

## 🐳 Docker

### Backend only

```bash
cd go_backend
docker build -t shortly-backend .
docker run -p 8080:8080 shortly-backend
```

### Full stack (backend + DB)

```bash
cd go_backend
docker compose up -d
```

Frontend dev is recommended to be run separately.

---

## 📘 Code Quality

* TypeScript strict typing
* `apiFetch` error + rate-limit handling
* ESLint + Prettier
* Comment guidelines:

  * Google TypeScript
  * Facebook React
  * No decorative/fancy comments
  * Clear + purposeful

---

## 🔄 Branching Model

Primary branch: `main`

Feature branches → PR → merge.

---

## 📄 License

MIT License

---

## 👤 Author

Built by **Parth**

For hiring + collaboration
📧 **[parthoma7@gmail.com](mailto:parthoma7@gmail.com)**

---

## ✅ Production Deployment

> <a href="https://shortly.streamlab.in" target="_blank" rel="noopener noreferrer">
>   https://shortly.streamlab.in
> </a>


This repository is a **simplified showcase version**.

---

## 🙌 Contributions

This repo is **not accepting external PRs**.

---

Thanks for reviewing the project!
