```bash
go_backend/
├── cmd/
│   └── server/
│       └── main.go               # Package main: starts the HTTP server and initializes dependencies.
│
├── internal/
│   ├── handlers/
│   │   ├── auth/                 # Package auth provides handlers for user authentication flows,
│   │   │                         # including Google OAuth, registration, and login.
│   │   ├── urls/                 # Package urls provides handlers for URL shortening, redirection,
│   │   │                         # and code redemption features.
│   │   └── users/                # Package users provides handlers for managing user profiles,
│   │                             # updating usernames, and fetching user shortlink data.
│   │
│   ├── middleware/               # Package middleware defines reusable Gin middleware functions,
│   │                             # such as CORS, rate limiting, authentication, and input validation.
│   │
│   ├── models/                   # Package models defines core data models and input/output structs
│   │                             # shared across handlers (e.g., RegisterInput, LoginInput).
│   │
│   ├── security/                 # Package security provides password hashing, token management,
│   │                             # and other cryptographic utilities.
│   │
│   ├── storage/                  # Package storage initializes and manages connections to external
│   │                             # persistence layers such as Redis or PostgreSQL.
│   │
│   └── utils/                    # Package utils contains helper utilities for cookies, validation,
│                                 # or small shared helpers not tied to a specific domain.
│
└── router/
    └── router.go                 # Package router defines all HTTP routes and associates them
                                  # with their respective handlers and middleware.
```