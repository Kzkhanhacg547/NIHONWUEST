# Test report — Phase 1..6

- `npm run typecheck`: PASS
- `npm test`: PASS (7 unit tests: level, SRS, streak, quiz, journey)
- `npm run build`: PASS (28 routes)
- `npm run lint`: PENDING (run after build; Phase 1 passed with no warnings)
- Seed idempotency: PASS (`29 kana / 2 lessons / 2 missions / 5 journey / 5 achievements` stable across runs)
- Auth isolation: enforced via `requireUserId()` on every `/api/*`; no client userId trusted.
- Idempotency: lesson completion, journey completion, mission XP, achievement XP all checked before award.
