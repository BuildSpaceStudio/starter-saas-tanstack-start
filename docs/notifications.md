# Notification templates

Transactional emails live in `src/lib/notifications/`. Each helper (`sendWelcomeEmail`, `sendAdminInviteEmail`, etc.) first tries the managed template in Creator Studio by slug, then falls back to the inline HTML renderer in `templates.ts`.

## Shared configuration

All templates pull their product name and support address from `src/lib/site-config.ts`. Override these via env vars (see `.env.example`):

| Variable              | Default                 | Used for                                |
| --------------------- | ----------------------- | --------------------------------------- |
| `SITE_NAME`           | `Your Product`          | Subject lines, heading, footer branding |
| `SITE_DESCRIPTION`    | (empty)                 | Marketing preheader copy                |
| `SITE_CREATOR_EMAIL`  | `hello@example.com`     | Footer contact + `replyTo` on fallback  |
| `APP_URL`             | `http://localhost:3000` | Base URL for CTA links (`/dashboard`)   |

## Variables passed to managed templates

The wrapper in `src/lib/notifications/index.ts` always merges these into every `sendTemplate` call, so you can reference them from Creator Studio template markup:

- `productName`
- `creatorEmail`
- `dashboardUrl`
- `siteUrl`

Template-specific variables layer on top (e.g. `name`, `inviter`).

## Slugs and fallbacks

The HTML below is the inline fallback rendered when the managed template is not configured. It is intentionally minimal but already wired to use `siteConfig` and include a CTA.

### `saas-welcome`

Sent to end users on first sign-up. Includes a CTA that opens `/dashboard`.

```html
<h1>Welcome, {{name}}</h1>
<p>Your {{productName}} account is ready. You can sign in any time to pick up where you left off.</p>
<p>Start with the dashboard — it's the home base for everything in your workspace.</p>
<a href="{{dashboardUrl}}">Open your dashboard</a>
```

### `saas-admin-invite`

```html
<h1>Hello, {{name}}</h1>
<p><strong>{{inviter}}</strong> invited you to help manage {{productName}} as an administrator.</p>
<a href="{{siteUrl}}admin">Open the admin area</a>
```

### `saas-password-changed`

```html
<h1>Password changed</h1>
<p>Hi {{name}}, this confirms your {{productName}} password was just changed.</p>
<p>If this wasn't you, reply to this email right away so we can help secure your account.</p>
```

### `saas-account-deleted`

```html
<h1>Account deleted</h1>
<p>Hi {{name}}, this message confirms that your {{productName}} account and its data have been deleted.</p>
```
