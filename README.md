# ApplyLens

Track every application, follow-up, and outcome in one place. Stop losing track of where you applied and start understanding what's actually working.

## Stack
- **Next.js 14** (App Router)
- **PostgreSQL** via Prisma ORM
- **Resend** for email reminders

---

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Set up your database
Get a free PostgreSQL URL from [Neon](https://neon.tech) or [Supabase](https://supabase.com).

Copy `.env.local` and fill in your values:
```bash
cp .env.local .env.local   # already there, just edit it
```

### 3. Push the schema to your database
```bash
npm run db:push
```

### 4. Run the dev server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to the dashboard.

---

## Project Structure

```
src/
  app/
    api/applications/       ← REST API routes (GET, POST, PATCH, DELETE)
    dashboard/              ← Main view with stats + application table
    applications/new/       ← Form to add a new application
  lib/
    prisma.ts               ← DB client singleton
    validations.ts          ← Zod schemas for input validation
  types/
    index.ts                ← Shared types, status labels, colors
prisma/
  schema.prisma             ← Database schema
```