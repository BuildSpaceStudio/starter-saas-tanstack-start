function readEnv(key: string): string | undefined {
  if (typeof process !== 'undefined' && process.env) {
    const value = process.env[key]
    if (value && value.length > 0) {
      return value
    }
  }
  return undefined
}

export const siteConfig = {
  name: readEnv('SITE_NAME') ?? 'Your Product',
  description:
    readEnv('SITE_DESCRIPTION') ??
    'A modern SaaS template with marketing pages, customer dashboard, and admin tools.',
  creatorEmail: readEnv('SITE_CREATOR_EMAIL') ?? 'hello@example.com',
  links: {
    home: '/',
    dashboard: '/dashboard',
    pricing: '/pricing',
    settings: '/settings',
  },
} as const

export type SiteConfig = typeof siteConfig

export function getSiteBaseUrl(): string {
  return readEnv('APP_URL') ?? 'http://localhost:3000'
}

export function getSiteUrl(path: string = '/'): string {
  const base = getSiteBaseUrl().replace(/\/$/, '')
  const suffix = path.startsWith('/') ? path : `/${path}`
  return `${base}${suffix}`
}
