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
- **Day 6** — Profile page (`/u/:username`, public): hero section with avatar upload, skills grid with endorsement counts, projects showcase, in-place edit mode for bio/location/GitHub/skills (owner-only), and a lightweight add-project form.
- **Fix (post-Day 6)** — project creation and avatar upload weren't persisting: both mutations forced a boundary-less `Content-Type: multipart/form-data` header, which broke multipart parsing server-side. Fixed by letting the browser set the header, plus added error handling so a failed submit no longer looks successful.
- **Day 7** — Blog system: list view (`/blog`), single post view with Markdown rendering (`/blog/:slug`), and a create/edit page (`/blog/new`, `/blog/:slug/edit`) with a live Markdown preview toggle. Backend blog routes wired in; owner-only edit/delete.
- **Day 8** — Developer search & discovery (`/search`): filter by skill and/or location, paginated results as developer cards linking to their profile.
- **Day 9** — Connection system: send/accept/reject requests, `/connections` page (pending + accepted lists), a `ConnectButton` on profiles that reflects live status (none/pending sent/pending received/connected), and a mutual-connections indicator on other users' profiles.
- **Day 10** — Skill endorsements: connected developers can endorse each other's skills (backend already enforced this via the `ACCEPTED` connection check — wired in today), skills now come back sorted by endorsement count with an `endorsedByMe` flag, `SkillsGrid` shows a 🏆 badge on the top skill and inline endorse buttons for connected viewers.
- **Day 10 UX** — Dark/light mode (persisted, OS-preference fallback), password show/hide on Login+Register, and a single reusable `Navbar` (Home/Discover/Connections/Blog/My profile/Logout/theme toggle) wired into every authenticated page.
- **Day 11** — Real-time notifications: server now runs on a raw `http.Server` with Socket.io attached (`initSocket`), JWT-authenticated per socket, pushes live events for connection requests/accepts and endorsements. `GET /api/notifications` now resolves the actor's name/avatar for display. `NotificationBell` in the navbar shows an unread-count badge and a dropdown, updating live via the socket and on click-to-mark-read.
- **Day 12** — Responsive design: `Navbar` collapses into a hamburger drawer below `sm`, icon buttons (theme, notifications, hamburger) bumped to 44px touch targets, notification dropdown width capped to viewport so it can't clip off-screen on narrow phones, Profile hero stacks vertically on mobile, Connections rows truncate long names instead of pushing action buttons off-screen, SkillsGrid's endorse control got a real tap-target instead of a bare glyph.
- **Day 13** — Real Dashboard: stats row (projects/posts/connections), activity feed from your connections' posts, "Trending on DevConnect" (recent site-wide posts outside your network — no view/like schema exists, so this is a defensible recency-based proxy, not a real trending algorithm), and connection suggestions with a live `ConnectButton` per suggestion. Backend `dashboard.routes.ts` gained the `trending` query; frontend `Dashboard.tsx` replaced the Day-5 placeholder.
- **Day 14** — Testing, performance, security:
  - **Testing**: 13 backend Jest tests (JWT sign/verify, `responseFormatter`, `requireAuth` — all four token-source branches) and 9 frontend Vitest+RTL tests (`PasswordInput` visibility toggle, `SkillsGrid` empty state / rendering / endorse-control visibility logic). All actually executed and passing, not just typechecked.
  - **Performance**: route-level code splitting via `React.lazy`/`Suspense` — Login now ships a 2.84KB chunk instead of the full ~460KB bundle; `React.memo` on `ProjectCard`/`DeveloperCard` (pure list items re-rendered in grids).
  - **Security**: found and fixed a real gap — avatar/project image uploads had a size cap but no `fileFilter`, so any file type could be uploaded as an "image." Added `helmet`, rate-limiting on `/register` and `/login` (20 attempts/15min/IP), and a startup warning if `JWT_SECRET` is unset in production. Reviewed and confirmed already-safe: Prisma parameterizes all queries (no injection surface), `react-markdown` doesn't render raw HTML (no stored XSS via blog posts), bcrypt at 10 rounds, CORS restricted to `CLIENT_URL`.
- **Day 15** — Final: deployment, documentation, demo prep.
  - `docs/api-reference.md` — every endpoint, method, auth requirement, and payload shape
  - `docs/user-flows.md` — Mermaid diagram, registration → profile → connect → endorse
  - `docs/deployment-guide.md` — exact Vercel/Railway/Neon steps and env vars (not run — this sandbox can't reach those services or hold real credentials; written so you can follow it directly)
  - `docs/e2e-test-checklist.md` — consolidated manual test plan across all 15 days, two-account scenarios for connections/endorsements/notifications
  - `docs/demo-script.md` — 7-minute demo script with timings and anticipated Q&A
  - `server/README.md`, `client/README.md`, `shared/README.md` — per-package docs
  - Final full-repo verification: 22/22 tests passing (13 backend + 9 frontend), `tsc --noEmit` clean on both packages, `vite build` succeeds (349 modules, confirmed code-split)

## Production Deployment

Frontend: https://devconnect-client-kappa.vercel.app

Backend API: https://devconnect-production-acc7.up.railway.app

Database: Neon PostgreSQL

Backend hosting: Railway

Frontend hosting: Vercel

Image storage: Cloudinary

Real-time: Socket.io

## Schema
See [`docs/database-schema.md`](docs/database-schema.md) for the full ERD and design notes.

To seed sample data after migrating: `npm run prisma:seed --workspace=server`

## Documentation
- [`docs/api-reference.md`](docs/api-reference.md) — every endpoint
- [`docs/database-schema.md`](docs/database-schema.md) — ERD + design notes
- [`docs/user-flows.md`](docs/user-flows.md) — core journey diagram
- [`docs/deployment-guide.md`](docs/deployment-guide.md) — Vercel/Railway/Neon setup
- [`docs/e2e-test-checklist.md`](docs/e2e-test-checklist.md) — manual test plan
- [`docs/demo-script.md`](docs/demo-script.md) — 7-minute demo script
