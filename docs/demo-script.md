# Demo Script — DevConnect (≈7 minutes)

For the Code A Nova internship presentation. Timings are approximate — practice once and adjust.

## Setup before you start (not part of the timed demo)
- Two browser windows/profiles logged in as two different connected-or-connectable test users
- Dark mode set to whichever looks better projected
- One test blog post and one test project already seeded, so you're not typing during the demo

## 0:00 – 0:45 — Architecture in one breath
"DevConnect is a full-stack developer networking platform — React/Vite frontend, Express/TypeScript backend, PostgreSQL via Prisma, deployed across Vercel/Railway/Neon. It's built incrementally over 15 days matching the project brief's milestone plan, with every day's work independently committed and tested." *(Show the GitHub commit history — 15 clearly labeled commits is a strong visual.)*

## 0:45 – 2:00 — Auth & Profile
- Register a new account live (or log in if you pre-seeded one) — mention JWT + httpOnly cookie, and that "Continue with GitHub" is a full OAuth integration, not a stub.
- Land on Dashboard, click through to your profile.
- Edit bio/skills live, upload an avatar. *(This is worth 20 seconds — it's a good visual and demonstrates Cloudinary integration + the multipart upload path.)*
- Add a project card.

## 2:00 – 3:00 — Blog
- Open the blog editor, show the Markdown live-preview toggle.
- Publish, show it rendered on the post page.
- Mention: owner-only edit/delete, enforced both in the UI and server-side.

## 3:00 – 4:30 — Search, Connect, Endorse (the two-window part)
- Search for a developer by skill.
- From Window A, visit Window B's profile, click Connect.
- Switch to Window B — **the notification badge updates live** (Socket.io) — accept the request.
- Endorse a skill from Window A — again, live notification on Window B.
- Point out the 🏆 badge on the most-endorsed skill.

*This section is the demo's centerpiece — it's the one place where "real-time" is actually visible, so don't rush it.*

## 4:30 – 5:30 — Dashboard
- Show the stats row, activity feed (from connections), trending (outside your network), and connection suggestions with a live Connect button right from the dashboard.

## 5:30 – 6:15 — Responsive & Dark Mode
- Shrink the browser or open DevTools device mode — show the hamburger menu.
- Toggle dark mode, refresh to show it persists.

## 6:15 – 7:00 — Wrap-up talking points
- "Every route is code-split — the login page loads a 2.8KB chunk, not the full bundle."
- "22 automated tests across backend (Jest) and frontend (Vitest + Testing Library), all passing."
- "Security review caught a real gap — image uploads had no file-type validation — fixed with a shared, validated multer config, plus rate-limiting on auth endpoints and helmet."
- Point to `docs/database-schema.md` (ERD), `docs/api-reference.md`, and the day-by-day log in the README if asked for depth.

## Anticipated Q&A
- **"Why Prisma?"** — type-safe queries, migrations as code, avoids hand-written SQL string-building (injection surface).
- **"How does real-time work?"** — Socket.io, JWT-authenticated per socket at handshake, server maps `userId -> socket ids` so a notification reaches every open tab.
- **"What would you do with more time?"** — real E2E automation (Playwright), a genuine trending algorithm backed by view/like counts, image optimization pipeline beyond Cloudinary's defaults.
