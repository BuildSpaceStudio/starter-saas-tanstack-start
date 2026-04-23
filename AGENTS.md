# Agent Guide

- Auth goes through `@buildspacestudio/sdk`. Never import Better Auth directly.
- Database tables live in `src/lib/db/schema.ts`.
- Use server functions for mutations. Do not add random mutable POST endpoints.
- Protected pages belong under `src/routes/_app.tsx`; admin pages belong under `src/routes/_app.admin.tsx`.
- TanStack Query owns server-state caching. Invalidate query keys after successful mutations.
- `src/routeTree.gen.ts` is generated. Never hand-edit it.
- Events use the starter wrappers and must not leak secrets or noisy PII.
- Emails use helpers in `src/lib/notifications/index.ts`. Do not install another mail provider.
- Transactional emails do not require `marketingOptIn`; any future marketing mail must respect it.
- Run `bun run typecheck && bun run lint && bun run build` before committing.
