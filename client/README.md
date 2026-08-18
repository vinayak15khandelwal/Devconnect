# client — DevConnect Frontend

React 18 + Vite + TypeScript + Tailwind.

## Structure
```
src/
  pages/            one file per route
  components/       shared UI (Navbar, cards, ConnectButton, PasswordInput, ...)
  context/          AuthContext, ThemeContext
  lib/               api.ts (axios instance), socket.ts (Socket.io client)
  store/             Zustand UI-only state
  test/              Vitest setup
```

Routes are lazy-loaded (`React.lazy` + `Suspense` in `App.tsx`) for smaller initial bundles.

## Local dev
```bash
cp .env.example .env   # VITE_API_URL, defaults to http://localhost:4000
npm run dev              # http://localhost:5173
```

## Tests
```bash
npm run test              # or: npm run test:client from the repo root
```

Dark mode is class-based (`tailwind.config.js` → `darkMode: "class"`), toggled via `ThemeContext`, persisted in `localStorage`.
