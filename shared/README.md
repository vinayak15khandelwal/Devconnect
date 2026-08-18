# shared — DevConnect Types

TypeScript interfaces used by both `client` and `server` (`User`, `Project`, `BlogPost`, `Connection`, etc.) — the single source of truth for API response shapes, so the two packages can't silently drift apart.

Imported as `@shared/index` — aliased in both `server/tsconfig.json` (typechecking) and `client/vite.config.ts` (actual bundling; tsconfig `paths` alone doesn't resolve at runtime).

No build step — consumed directly as `.ts` source by both packages.
