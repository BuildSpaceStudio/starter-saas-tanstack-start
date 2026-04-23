# Agent conventions

Read this when working on auth, routes, the data layer, client/server state, events, or email.

## Auth and SDK

- Use `@buildspacestudio/sdk` for auth. Do not import Better Auth directly in application code.

## Data and mutations

- Database schema lives in `src/lib/db/schema.ts`.
- Prefer TanStack Start server functions for mutations. Do not add ad-hoc mutable POST endpoints unless there is a strong reason.
- TanStack Query owns server-state caching. Invalidate the relevant query keys after successful mutations.

## Routes and layouts

- User-facing app routes belong under the layout wired from `src/routes/_app.tsx`.
- Admin routes belong under the layout from `src/routes/_app.admin.tsx`.

## Generated files

- `src/routeTree.gen.ts` is generated. Never edit it by hand.

## Events

- Use the starter’s event helpers. Do not emit secrets or unnecessary PII.

## Email

- Send email through `src/lib/notifications/index.ts`. Do not add another mail provider. For templates, env vars, and slugs, see [notifications.md](notifications.md).
- Transactional email does not require `marketingOptIn`. Any future marketing email must respect it.
