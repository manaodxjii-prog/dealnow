# DEALNOW
Multi-store e-commerce platform (Next.js + Firebase). See `docs/ARCHITECTURE.md` and `docs/DATABASE.md`.

## Status
- [x] Phase 1: Architecture, schema, shared types, plans, indexes, design tokens
- [ ] Phase 2: Auth + Multi-Store
- [ ] Phase 3: Security Rules + emulator tests
- [ ] Phase 4-12: see plan

## Setup (after Phase 2 adds the app)
1. `cp .env.example apps/web/.env.local` and fill Firebase web config (public values only)
2. `npm install && npm run build:shared`
3. `npm run emulators` / `npm run dev`
