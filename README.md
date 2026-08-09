# DevConnect

Developer networking & portfolio platform — built for the Code A Nova 15-Day Internship (Full Stack Development track).

**Stack:** React 18 + Vite + Tailwind · Node/Express + TypeScript · PostgreSQL + Prisma · JWT + GitHub OAuth · Cloudinary · Socket.io · React Query + Zustand

## Monorepo structure
```
client/   React + Vite frontend
server/   Express + TypeScript API
shared/   TypeScript types shared by both
```

## Local setup
1. `npm install` (installs all three workspaces)
2. Copy env files:
   - `cp server/.env.example server/.env` → fill in `DATABASE_URL` (a free [Neon](https://neon.tech) Postgres URL works great), `JWT_SECRET`
   - `cp client/.env.example client/.env`
3. Push the Prisma schema to your database: `npm run prisma:migrate --workspace=server`
4. Run the API: `npm run dev:server` → http://localhost:4000/health
5. Run the client: `npm run dev:client` → http://localhost:5173

## Progress log
- **Day 1** — Monorepo (client/server/shared) scaffolded, shared TypeScript types defined, env config templates added, Prisma schema written, database connectivity verified via `/health`.
- **Day 2** — Ran the initial migration against Postgres (Users, Projects, BlogPosts, Skills, UserSkills, Endorsements, Connections, Notifications), added a seed script with sample data, documented the schema as an ERD in `docs/database-schema.md`.
- **Day 3** — Backend auth: email/password registration + login issuing JWTs (httpOnly cookie + bearer fallback), `/api/auth/me`, and full GitHub OAuth (authorize → callback → token exchange → user upsert). Consistent `{success, data, message}` response shape added via middleware.
- **Day 4** — Profile CRUD (view by username with skills + endorsement counts, update bio/location/skills, avatar upload), project CRUD (create/update/delete with tech stack + optional image), both wired to Cloudinary for 2MB-capped image uploads.
- **Day 5** — Frontend auth: Login/Register pages, `AuthContext` (register/login/logout/GitHub OAuth redirect, hydrates from `/api/auth/me`, connects the notification socket), `ProtectedRoute` guarding `/dashboard`, React Query + React Router wired into `main.tsx`.

## Schema
See [`docs/database-schema.md`](docs/database-schema.md) for the full ERD and design notes.

To seed sample data after migrating: `npm run prisma:seed --workspace=server`
