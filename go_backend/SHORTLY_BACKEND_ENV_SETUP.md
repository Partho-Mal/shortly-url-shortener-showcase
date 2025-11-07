## 📘 Go Backend — Environment & Docker Setup Guide

This guide covers how to set up, run, test, and clean up your **Go backend** environment for `shortly-url-shortener`.

---

### 🗂️ Folder Structure

```
go_backend/
│
├── cmd/
│   └── server/
│       └── main.go
├── .env.local
├── .env.test
├── .env.docker
├── docker-compose.yml
└── bin/
    └── bash/
        └── docker_cleanup.sh
```

---

## ⚙️ 1. Environment Files

### 🧩 `.env.local`

Used when running **Go server locally** (Postgres + Redis in Docker).

```bash
# Redis (Docker container exposed to localhost)
REDIS_URL=redis://localhost:6379

# Local Postgres (Docker container exposed to localhost:5433)
POSTGRES_URL=postgres://testuser:testpass@localhost:5433/testdb?sslmode=disable

# App
PORT=8080
ENV=local
```

---

### 🧪 `.env.test`

Used for **testing** with the same Docker containers but isolated data.

```bash
REDIS_URL=redis://localhost:6379
POSTGRES_URL=postgres://testuser:testpass@localhost:5433/testdb_test?sslmode=disable

PORT=8081
ENV=test
```

---

### 🚢 `.env.docker`

Used when running the **entire app stack inside Docker**.

```bash
REDIS_URL=redis://shortly_redis:6379
POSTGRES_URL=postgres://testuser:testpass@shortly_postgres:5432/testdb?sslmode=disable

PORT=8080
ENV=production
```

---

### 🔐 `.env` (Real Production Keys)

> ⚠️ **Never commit this file** to Git.
> Used for deployed production environments (with real API keys).

```bash
REDIS_URL=redis://prod_redis_host:6379
POSTGRES_URL=postgres://realuser:realpassword@prod_db_host:5432/proddb?sslmode=require

PORT=8080
ENV=production
SECRET_KEY=your_production_secret_key
```

---

## 🐳 2. Start Docker Services (Postgres + Redis only)

Start containers:

```bash
docker compose up -d postgres redis
```

Verify they’re running:

```bash
docker ps
```

Expected output:

```
CONTAINER ID   IMAGE                PORTS
xxxxx          postgres:18-alpine   0.0.0.0:5433->5432/tcp
yyyyy          redis:8.2.3-alpine   0.0.0.0:6379->6379/tcp
```

---

## 💻 3. Run Go Backend Locally (with Docker DBs)

Once Redis & Postgres are running in Docker:

```bash
cd go_backend
go run cmd/server/main.go --env=.env.local
```

✅ Expected logs:

```
server: environment loaded from .env.local
redis: connection established successfully
postgres: connection established successfully
server: starting on port http://localhost:8080
```

---

## 🤪 4. Run Tests with `.env.test`

```bash
go run cmd/server/main.go --env=.env.test
```

This uses a separate test database (`testdb_test`) to avoid overwriting local data.

---

## 🐋 5. Run Everything in Docker (Full Stack)

To run your backend **entirely inside Docker**:

```bash
docker compose up --build
```

It automatically uses `.env.docker` for environment variables.

---

## 🧼 6. Clean Up Containers & Volumes

To stop and remove all containers, images, and volumes, use the cleanup script:

**File:** `go_backend/bin/bash/docker_cleanup.sh`

```bash
#!/bin/bash
echo "🧹 Stopping all containers..."
docker stop $(docker ps -aq)

echo "💏 Removing all containers..."
docker rm $(docker ps -aq)

echo "🧼 Removing all images..."
docker rmi $(docker images -q)

echo "💮 Removing all unused volumes..."
docker volume prune -f

echo "✅ Docker cleanup complete."
```

Make it executable:

```bash
chmod +x ./bin/bash/docker_cleanup.sh
```

Run it anytime:

```bash
./bin/bash/docker_cleanup.sh
```

---

## 🤩 Optional: Docker Health Check

You can check container health:

```bash
docker inspect --format='{{json .State.Health}}' shortly_postgres | jq
docker inspect --format='{{json .State.Health}}' shortly_redis | jq
```

---

## ✅ Summary

| Mode       | Runs in Docker | Go runs locally | Env file      | Start Command                                |
| ---------- | -------------- | --------------- | ------------- | -------------------------------------------- |
| Local      | Only DBs       | ✅               | `.env.local`  | `go run cmd/server/main.go --env=.env.local` |
| Test       | Only DBs       | ✅               | `.env.test`   | `go run cmd/server/main.go --env=.env.test`  |
| Docker     | ✅ Full stack   | ❌               | `.env.docker` | `docker compose up --build`                  |
| Production | ✅              | ❌               | `.env`        | CI/CD Deployment                             |
