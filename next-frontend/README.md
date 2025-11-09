# next-frontend · Shortly (Showcase Edition)

This repository contains the **showcase Next.js frontend for Shortly**, a URL-shortening + QR system.
It is intentionally lighter than the full production system and exists primarily so hiring teams and engineers can evaluate the architecture, code style, and patterns.

The full platform with advanced features is available at:
[https://shortly.streamlab.in](https://shortly.streamlab.in)

The complete source for this demo is open on GitHub.

---

## Table of Contents

1. Overview
2. Features
3. Tech Stack
4. Getting Started
5. Development Commands
6. Environment Variables
7. Project Structure
8. Code Style & Conventions
9. UI System (shadcn/ui)
10. Notes
11. License

---

## 1) Overview

Shortly-frontend is a **Next.js App Router project** used to:

* Create short links
* View & manage user links
* Generate QR codes
* Display visit analytics (basic)
* Provide a lightweight dashboard experience

This project integrates with a Go backend via REST APIs.

---

## 2) Features

* Public short-link creation
* Authenticated link management
* Basic QR code generation
* Visit count + last visit timestamps
* Theme toggling (light/dark/system)
* Mobile-aware sidebar + tooltip/drawer switching

*Excluded from this demo:*

* Payments
* Org-level features
* Deep analytics
* Billing
* RBAC

---

## 3) Tech Stack

| Layer      | Stack                           |
| ---------- | ------------------------------- |
| Framework  | Next.js (App Router)            |
| Language   | TypeScript                      |
| UI         | shadcn/ui + TailwindCSS         |
| Icons      | lucide-react                    |
| Data Fetch | fetch + wrapper (`apiFetch.ts`) |
| Auth       | Cookie-based (Go backend)       |
| Utilities  | date-fns, clsx, tailwind-merge  |

---

## 4) Getting Started

### Prerequisites

* Node >= 18
* Backend running locally (`shorty-go`)

### Install dependencies

```bash
npm install
```

### Configure environment

Copy `.env.example` to `.env.local` and update required keys.

```bash
cp .env.example .env.local
```

### Start dev server

```bash
npm run dev
```

Frontend:

```
http://localhost:3000
```

Backend expected at:

```
http://localhost:8080
```

---

## 5) Development Commands

```bash
npm run dev       # Start app
npm run build     # Production build
npm run lint      # Static analysis
npm run start     # Run built app
```

---

## 6) Environment Variables

Main variables:

```
NEXT_PUBLIC_BACKEND_URL
NEXT_PUBLIC_API_URL
NEXT_PUBLIC_USER_DETAILS
NEXT_PUBLIC_USER_SHORTLINKS
NEXT_PUBLIC_DELETE_SHORTLINK_ENDPOINT
NEXT_PUBLIC_OPTIONALCREATION
```

See `.env.example` for all available keys.

---

## 7) Project Structure

```
.
├── app
│   ├── api
│   ├── auth
│   ├── dashboard
│   ├── globals.css
│   ├── landing
│   ├── layout.tsx
│   ├── login
│   ├── page.tsx
│   ├── privacy-policy
│   ├── signup
│   └── terms-of-service
├── components
│   ├── AppSidebar.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── Navbar.tsx
│   ├── NoLoginShortenLinkForm.tsx
│   ├── QRCodeCustomizer.tsx
│   ├── ShortLinkForm.tsx
│   ├── ShortLinksList.tsx
│   ├── VideoPlayerSmart.tsx
│   └── ui  # shadcn components
├── hooks
├── lib
├── utils
├── public
├── tsconfig.json
├── next.config.ts
├── package.json
└── README.md
```

---

## 8) Code Style & Conventions

* TypeScript throughout
* Typed props
* Small single‑purpose functions
* Comments focused on intent and behavior
* Minimal global state
* Simple fetch wrapper via `apiFetch.ts`

Comments should prioritize clarity.

---

## 9) UI System (shadcn/ui)

UI primitives are sourced from:
[https://ui.shadcn.com](https://ui.shadcn.com)

* Headless, composable React components
* Local, versioned under `components/ui/*`
* Avoid modifying primitives directly. Prefer composition.

---

## 10) Notes

* This is a showcase build designed for hiring/evaluation
* Core flows implemented; advanced flows intentionally excluded
* Backend handles auth and business logic

---

## 11) License

MIT License
