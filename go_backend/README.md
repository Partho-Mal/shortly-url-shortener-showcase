# 🚀 Shortly - Go Backend (Showcase Edition)

This directory contains the **backend API service** for the **Shortly URL Shortener Showcase** project.

It provides:

* URL shortening
* QR code generation support
* Google OAuth login
* JWT-based auth
* Redis caching
* PostgreSQL persistence
* Rate limiting
* Minimal feature set (showcase-only)

> A full‑featured production build is available at **[https://shortly.streamlab.in](https://shortly.streamlab.in)**.
> This backend version is intentionally lightweight for hiring‑manager review and technical evaluation.

---

## ✨ Features

| Feature           | Description                      |
| ----------------- | -------------------------------- |
| URL Shortening    | Generate short redirecting slugs |
| Auth              | Google OAuth + JWT               |
| QR Support        | Prepare slugs for QR             |
| Redis             | Short‑term caching               |
| PostgreSQL        | Persistent storage               |
| Rate Limit        | Prevent abuse                    |
| Cookie Helpers    | Secure cookie utilities          |
| Modular Structure | Easy to extend                   |
| Distroless Docker | Secure runtime                   |

---

## 📁 Project Structure

```
go_backend
├── bin/
│   └── bash/
│       ├── caution_all_docker_cleanup.sh
│       └── docker_cleanup_shortly.sh
├── cmd/
│   ├── server/main.go            # App entry point
│   └── server_test/main.go
├── db.md                         # Database notes
├── docker-compose.yml            # Dev stack
├── Dockerfile                    # Distroless production image
├── go.mod / go.sum
├── internal/
│   ├── handlers/                 # Route handlers
│   │   ├── auth/                 # Login / validation
│   │   ├── urls/                 # Create/delete shortlinks
│   │   └── users/
│   ├── middleware/               # JWT, IP block, etc.
│   ├── models/                   # Data models
│   ├── security/                 # JWT utils + rate limiting
│   ├── storage/                  # Postgres + Redis clients
│   └── utils/                    # Slug, password, cookie helpers
├── router/router.go              # Route wiring
└── SHORTLY_BACKEND_ENV_SETUP.md  # Environment docs
```

Folders under `internal/` follow idiomatic Go layering.

---

## 🛠️ Tech Stack

| Component  | Choice                       |
| ---------- | ---------------------------- |
| Language   | Go 1.22+                     |
| Database   | PostgreSQL                   |
| Cache      | Redis                        |
| Auth       | Google OAuth + JWT           |
| Rate Limit | Redis‑based                  |
| Image      | Distroless                   |
| Router     | Chi/Gin (per implementation) |

---

## ✅ Requirements

| Dependency        | Version |
| ----------------- | ------- |
| Go                | ≥ 1.22  |
| PostgreSQL        | ≥ 14    |
| Redis             | ≥ 6     |
| Docker (optional) | latest  |

---

## ⚙️ Environment Setup

All env requirements are documented in:

```
SHORTLY_BACKEND_ENV_SETUP.md
```

Example `.env` excerpt:

```
APP_ENV=development
PORT=8080
BASE_URL=http://localhost:8080

POSTGRES_URL=postgres://testuser:testpass@postgres:5432/testdb?sslmode=disable
REDIS_URL=redis://redis:6379

GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
JWT_SECRET=xxx
```

---

## ▶️ Run Locally

### Option A - Go

```
go mod download
go run ./cmd/server
```

API → [http://localhost:8080](http://localhost:8080)

---

### Option B - Docker

```
docker build -t shortly-backend .
docker run -p 8080:8080 --env-file .env shortly-backend
```

---

### Option C - Docker Compose

```
docker compose up --build
```

Shuts down:

```
docker compose down
```

---

## 📡 API Overview

| Method | Endpoint              | Auth  | Description      |
| ------ | --------------------- | ----  | ---------------- |
| GET    | /health               | ❌    | Health           |
| POST   | /api/shorten          | ✅    | Create short URL |
| POST   | /api/delete/shortlink | ✅    | Delete URL       |
| GET    | /user/shortlinks      | ✅    | User URLs        |
| GET    | /google/login         | ❌    | OAuth start      |
| GET    | /google/callback      | ❌    | OAuth callback   |
| GET    | /user/details         | ✅    | Profile          |
| GET    | /:slug                | ❌    | Redirect         |

---

## 🔐 Auth

* Google OAuth
* JWT w/ secure cookie
* Middleware controls access

---

## 🚦 Middleware

* Authentication
* Rate limiting
* IP block list
* URL + slug validation

---

## 🏗️ Build Details

Static build:

```
CGO_ENABLED=0 GOOS=linux go build
```

Runtime:

```
gcr.io/distroless/static-debian12
```

---

## ✅ Code Quality

* Idiomatic `internal/` tree
* Modular services
* Separate handlers + business logic
* Env‑based config

---

## 📜 License

Released under the **MIT License**.

---

## 👨‍💻 Author

**Partho Mal**
[https://streamlab.in](https://streamlab.in)

For collaboration or hiring inquiries - always open to chat.
