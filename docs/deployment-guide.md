# Deployment Guide — DevConnect

Per the brief: frontend → Vercel, backend → Railway, database → Neon. All free tiers, no paid services. This needs your own accounts — I can't run these steps for you, but here's exactly what to do.

## 1. Database — Neon
1. [neon.tech](https://neon.tech) → new project → copy the connection string (`postgresql://...`).
2. Locally: `server/.env` → `DATABASE_URL="<that string>"` → `npm run prisma:migrate --workspace=server -- --name init` → `npm run prisma:seed --workspace=server` (optional).
3. Keep this connection string — you'll paste it into Railway's env vars too.

## 2. Backend — Railway
1. [railway.app](https://railway.app) → New Project → Deploy from GitHub repo → select your `devconnect` repo.
2. **Root directory**: `server` (Railway needs to know this isn't a single-package repo).
3. **Build command**: `npm install && npm run build` (runs `tsc`, outputs to `dist/`).
4. **Start command**: `npm run start` (already `node dist/index.js` in `server/package.json`).
5. Environment variables (Settings → Variables) — copy every key from `server/.env.example`:
   - `DATABASE_URL` — from Neon
   - `JWT_SECRET` — generate a real one: `openssl rand -base64 32`
   - `JWT_EXPIRES_IN=7d`
   - `CLIENT_URL` — your Vercel URL once you have it (step 3) — **update this after deploying the frontend**, then redeploy
   - `PORT` — Railway sets this automatically; don't override it
   - `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` / `GITHUB_CALLBACK_URL` — see step 4
   - `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` — from cloudinary.com
   - `NODE_ENV=production` — enables the secure cookie flag and the JWT_SECRET startup check
6. Deploy. Note the generated `*.up.railway.app` URL — that's your API base.
7. Run the migration against the *production* DB once: either add a Railway one-off run of `npm run prisma:migrate --workspace=server -- --name init`, or run it locally pointed at the Neon URL (same effect, simpler).

## 3. Frontend — Vercel
1. [vercel.com](https://vercel.com) → New Project → import your GitHub repo.
2. **Root directory**: `client`.
3. Framework preset: Vite (auto-detected).
4. Environment variable: `VITE_API_URL` = your Railway URL from step 2.6.
5. Deploy. Note the `*.vercel.app` URL.
6. Go back to Railway and set `CLIENT_URL` to this URL, redeploy the backend (needed for CORS + the GitHub OAuth redirect + cookie `sameSite` to work correctly).

## 4. GitHub OAuth App (for the "Continue with GitHub" button)
1. [github.com/settings/developers](https://github.com/settings/developers) → New OAuth App.
2. Homepage URL: your Vercel URL.
3. Authorization callback URL: `https://<your-railway-app>.up.railway.app/api/auth/github/callback`.
4. Copy Client ID + generate a Client Secret → into Railway's env vars.

## 5. Cloudinary (image uploads)
1. [cloudinary.com](https://cloudinary.com) free tier → Dashboard shows Cloud Name, API Key, API Secret directly.
2. Paste into Railway's env vars.

## Post-deploy checklist
- [ ] `https://<railway-app>/health` returns `{"success":true,...}`
- [ ] Register a new user from the deployed frontend, confirm login persists across refresh
- [ ] Upload an avatar, confirm it round-trips through Cloudinary
- [ ] "Continue with GitHub" completes the full OAuth redirect loop
- [ ] Two browser sessions: connect, accept, endorse — confirm live notifications work over the deployed Socket.io connection (this is the one most likely to need a CORS/`CLIENT_URL` double-check if it doesn't fire)
- [ ] Dark mode persists across a refresh on the deployed site

## Why this wasn't run for you
This sandbox's network is restricted to package registries (npm, PyPI, crates) and GitHub — it can't reach `neon.tech`, `railway.app`, `vercel.com`, or `cloudinary.com`, and none of these services accept API keys I have access to. Every step above needs your own account and credentials.
