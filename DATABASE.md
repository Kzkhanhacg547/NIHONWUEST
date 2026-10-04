# DATABASE

Schema: `prisma/schema.prisma`. SQLite provider locally. For production use:

```prisma
datasource db {
  provider = "postgresql"
  url = env("DATABASE_URL")
}
```

Workflow:

```bash
npx prisma migrate dev --name init
npm run db:seed
```

Seed is idempotent via `upsert` on unique keys (kana character+script, lesson slug, journey slug, achievement key, mission key).
