# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Job Tracker** — A Next.js 14 application for tracking job applications, statuses, and follow-up reminders.

**Stack:**
- Next.js 14 (App Router)
- PostgreSQL via Prisma ORM
- Resend for email reminders
- TypeScript, Zod for validation

---

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Run production build |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push Prisma schema to database |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:generate` | Generate Prisma client |

---

## Architecture

### Project Structure
```
src/
  app/
    api/applications/       ← REST API routes (GET, POST, PATCH, DELETE)
    dashboard/              ← Main view with stats + application table
    applications/new/       ← Form to add a new application
    page.tsx                ← Redirects to /dashboard
    layout.tsx              ← Root layout + globals.css
  lib/
    prisma.ts               ← DB client singleton (prevents connection exhaustion in dev)
    validations.ts          ← Zod schemas for input validation
  types/
    index.ts                ← Shared types, status labels, colors, pipeline order
prisma/
  schema.prisma             ← Database schema
```

### Database Schema (`prisma/schema.prisma`)
- **Application** model with fields: `id`, `company`, `role`, `status`, `appliedDate`, `followUpDate`, `jobUrl`, `salary`, `location`, `notes`, `createdAt`, `updatedAt`
- **ApplicationStatus** enum: `WISHLIST`, `APPLIED`, `PHONE_SCREEN`, `INTERVIEW`, `OFFER`, `REJECTED`, `WITHDRAWN`

### API Routes (`src/app/api/applications/`)
- `GET /api/applications` — Fetch all applications (newest first)
- `POST /api/applications` — Create new application
- `PATCH /api/applications/:id` — Update application (partial update via `ApplicationSchema.partial()`)
- `DELETE /api/applications/:id` — Delete application

All routes use Zod validation via `ApplicationSchema` and return standardized error responses.

### Frontend Pages
- **Dashboard** (`/dashboard`) — Server Component; fetches data directly via Prisma, displays stats by status + application table
- **New Application** (`/applications/new`) — Client Component; form with validation, submits to API

### Shared Types (`src/types/index.ts`)
- `ApplicationStatus` type union
- `Application` interface matching DB model
- `STATUS_LABELS` — Human-readable labels for each status
- `STATUS_COLORS` — Hex colors for status badges
- `PIPELINE_STATUSES` — Ordered array for pipeline/kanban views

### Validation (`src/lib/validations.ts`)
- `ApplicationSchema` — Zod schema for create/update
- `ApplicationInput` — Inferred TypeScript type

### Database Client (`src/lib/prisma.ts`)
- Singleton pattern using `globalThis` to prevent multiple connections during Next.js hot reload
- Logs queries in development

---

## Development Notes

### Environment Setup
1. Copy `.env.local` and add `DATABASE_URL` (PostgreSQL from Neon, Supabase, etc.)
2. Run `npm run db:push` to create tables
3. Run `npm run dev`

### Key Patterns
- **Server Components by default** — Dashboard fetches data directly on server
- **Client Components only when needed** — Form uses `"use client"` for interactivity
- **Inline styles** — No CSS-in-JS library; uses CSS variables defined in `globals.css`
- **Path alias** — `@/*` maps to `src/*` (configured in `tsconfig.json`)

### Future Enhancements (from README)
1. Click row → edit/detail page
2. Kanban board view (drag cards between status columns)
3. Follow-up reminder emails via Resend (cron job)
4. Auth with Clerk or NextAuth (multi-user)
5. Deploy to Vercel