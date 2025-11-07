# syntax=docker/dockerfile:1

##########################################################
# Stage 1: Build the Go binary
# --------------------------------------------------------
# This stage compiles the Shortly backend statically using Go 1.22.
# Uses Alpine for small size and reproducible build.
##########################################################
FROM golang:1.25.4-alpine3.22 AS builder

# Set working directory inside container
WORKDIR /app

# Cache dependencies first (improves build speed)
COPY go.mod go.sum ./
RUN go mod download

# Copy the remaining source code
COPY . .

# Build the Go binary with static linking for distroless runtime
RUN CGO_ENABLED=0 GOOS=linux go build -o shortly ./cmd/server

##########################################################
# Stage 2: Minimal runtime image (Distroless)
# --------------------------------------------------------
# This stage runs the compiled binary inside Google's
# distroless container (Debian 12-based) for maximum security.
##########################################################
FROM gcr.io/distroless/static-debian12

# Set working directory
WORKDIR /app

# Copy compiled binary from builder
COPY --from=builder /app/shortly .

# Use non-root user for better security
USER nonroot:nonroot

# Expose HTTP port
EXPOSE 8080

# Environment variables
ENV PORT=8080
ENV POSTGRES_URL=postgres://testuser:testpass@postgres:5432/testdb?sslmode=disable

# Run the binary directly
ENTRYPOINT ["/app/shortly"]
