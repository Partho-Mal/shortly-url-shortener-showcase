# syntax=docker/dockerfile:1

##############################
# Stage 1 — Build
##############################
FROM golang:1.25.4-alpine3.22 AS builder

WORKDIR /app

# Cache deps
COPY go.mod go.sum ./
RUN go mod download

# Copy source + build
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o shortly ./cmd/server


##############################
# Stage 2 — Runtime
##############################
FROM gcr.io/distroless/static-debian12

WORKDIR /app

# Copy built binary
COPY --from=builder /app/shortly .

USER nonroot:nonroot
EXPOSE 8080

# Default environment values (overridable)
ENV PORT=8080 \
    POSTGRES_URL=postgres://testuser:testpass@postgres:5432/testdb?sslmode=disable

ENTRYPOINT ["/app/shortly"]
