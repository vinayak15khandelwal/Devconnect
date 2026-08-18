# server — DevConnect API

Express + TypeScript + Prisma/PostgreSQL.

## Structure
```
src/
  index.ts          entry point — express app, http server, Socket.io init
  routes/           one file per resource (auth, profile, projects, blog, ...)
  middleware/        auth, response formatting, rate limiting, error handling
  lib/               prisma client, jwt, cloudinary, upload config
  socket/            Socket.io setup + notifyUser()
  __tests__/         Jest unit tests
prisma/
  schema.prisma      full data model
  seed.ts            sample data for local testing
```

## Local dev
```bash
cp .env.example .env   # fill in DATABASE_URL at minimum
npm run prisma:migrate -- --name init
npm run dev             # http://localhost:4000
```

## Tests
```bash
npm run test            # or: npm run test:server from the repo root
```

See `../docs/api-reference.md` for the full endpoint list and `../docs/database-schema.md` for the ERD.
