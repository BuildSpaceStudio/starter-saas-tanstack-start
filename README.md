# starter-saas-tanstack-start

[![TanStack Start](https://img.shields.io/badge/TanStack%20Start-Framework-0f172a?style=flat-square)](https://tanstack.com/start/latest/docs/framework/react/overview)
[![Buildspace](https://img.shields.io/badge/Buildspace-Services-1d4ed8?style=flat-square)](https://buildspace.studio)
[![Drizzle](https://img.shields.io/badge/Drizzle-ORM-8b5cf6?style=flat-square)](https://orm.drizzle.team)
[![shadcn/ui](https://img.shields.io/badge/shadcn-ui-111827?style=flat-square)](https://ui.shadcn.com)
[![TanStack Query](https://img.shields.io/badge/TanStack%20Query-Server%20State-ef4444?style=flat-square)](https://tanstack.com/query/latest)

A polished starter SaaS template for Buildspace creators who want a landing page, hosted auth, a query-powered dashboard, and an admin surface on day one.

## Quickstart

```bash
npm i -g @buildspacestudio/cli
buildspace auth login
buildspace app create --name "My SaaS"
buildspace init --app <slug>
cd <slug>
buildspace env pull --env dev --output .env
bun install
bun run db:migrate
bun dev
```

## What's included

- Hosted Buildspace sign-in and sign-up flow with HTTP-only session cookies
- Turso/libSQL + Drizzle ORM database layer with starter user schema
- Marketing landing page and pricing page
- Authenticated dashboard, settings, notifications, and admin surfaces
- Buildspace events wiring for core product analytics
- Buildspace notification helpers with starter transactional email fallbacks

## Env vars

| Variable | Scope | Notes |
| --- | --- | --- |
| `BUILDSPACE_SECRET_KEY` | server | Buildspace secret key, `bs_sec_*` |
| `VITE_PUBLIC_BUILDSPACE_PUBLISHABLE_KEY` | client | Browser-safe publishable key |
| `BUILDSPACE_DB_URL` | server | libSQL URL, optional locally |
| `BUILDSPACE_DB_TOKEN` | server | libSQL auth token, optional locally |
| `APP_URL` | server | Public base URL, usually `http://localhost:3000` |
| `SESSION_COOKIE_NAME` | server | Defaults to `bs_session` |

## Local development

```bash
bun install
bun run db:generate
bun run db:migrate
bun run db:seed
bun dev
```

After schema changes, rerun `bun run db:generate` and commit the generated output.

## Deploy

Use the normal Buildspace deployment flow:

```bash
buildspace deploy
```

The current TanStack Start build in this repo emits `dist/server/server.js`, which fits Railway cleanly as a normal Node server.

## Replace before launch

- Placeholder marketing copy and pricing values
- Footer attribution and docs links if they do not fit your product
- `public/opengraph-image.png`
- Notification template slugs and HTML in `docs/notifications.md`

## Extending

- Add routes in `src/routes`
- Add tables in `src/lib/db/schema.ts`
- Add query option builders in `src/lib/queries`
- Add secure mutations in `src/lib/mutations`
- Add product events in `src/lib/events.ts` and `src/lib/events-client.ts`
- Add new transactional emails in `src/lib/notifications`

## Skills

The repo ships with `.claude/skills/` preloaded for `buildspace-sdk`, `buildspace-examples`, `buildspace-cli`, and `tanstack-start`.

## License

MIT
