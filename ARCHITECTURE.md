# ARCHITECTURE

Decision: Next.js full-stack monolith, Auth.js credentials + Prisma adapter.

- Database: Prisma + SQLite for local/test, PostgreSQL for production.
  Same schema; only datasource provider/URL changes. Documented migration path.
- Auth: Auth.js v4. Passwords hashed with bcrypt; session strategy JWT.
  Middleware protects `/app/*` and `/onboarding`.
- Content lives in DB (`prisma/seed-data/*`), never hardcoded in components.
- Domain logic in `lib/*` (level/srs/streak/quiz/journey) — pure, unit tested.
- Server verifies identity with `requireUserId()`; never trusts client userId.
- AI deferred to Phase 8; core app works offline from seeded content.
