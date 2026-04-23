import { getSiteUrl, siteConfig } from '@/lib/site-config'

export const notificationTemplateSlugs = {
  welcome: 'saas-welcome',
  adminInvite: 'saas-admin-invite',
  passwordChanged: 'saas-password-changed',
  accountDeleted: 'saas-account-deleted',
} as const

interface EmailLayoutOptions {
  preheader?: string
  heading: string
  bodyHtml: string
  cta?: { label: string; url: string } | null
  footerNoteHtml?: string
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function renderEmailLayout({
  preheader,
  heading,
  bodyHtml,
  cta,
  footerNoteHtml,
}: EmailLayoutOptions): string {
  const productName = escapeHtml(siteConfig.name)
  const creatorEmail = escapeHtml(siteConfig.creatorEmail)
  const year = new Date().getFullYear()

  const ctaBlock = cta
    ? `
      <tr>
        <td style="padding: 28px 0 8px;">
          <a href="${cta.url}" style="display:inline-block;background:#111111;color:#ffffff;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">${escapeHtml(cta.label)}</a>
        </td>
      </tr>`
    : ''

  const preheaderBlock = preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${escapeHtml(preheader)}</div>`
    : ''

  const supportLine = `Need a hand? Just reply to this email or reach us at <a href="mailto:${creatorEmail}" style="color:#111111;text-decoration:underline;">${creatorEmail}</a>.`

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${escapeHtml(heading)}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#111111;">
${preheaderBlock}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 16px;">
  <tr>
    <td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:12px;padding:32px;box-shadow:0 1px 2px rgba(0,0,0,0.04);">
        <tr>
          <td style="font-size:13px;font-weight:600;letter-spacing:0.02em;color:#6b7280;text-transform:uppercase;">${productName}</td>
        </tr>
        <tr>
          <td style="padding-top:16px;font-size:24px;font-weight:700;line-height:1.3;color:#111111;">${escapeHtml(heading)}</td>
        </tr>
        <tr>
          <td style="padding-top:12px;font-size:15px;line-height:1.65;color:#374151;">${bodyHtml}</td>
        </tr>
        ${ctaBlock}
        <tr>
          <td style="padding-top:28px;font-size:13px;line-height:1.65;color:#6b7280;">
            ${supportLine}${footerNoteHtml ? `<br/>${footerNoteHtml}` : ''}
          </td>
        </tr>
        <tr>
          <td style="padding-top:24px;margin-top:24px;border-top:1px solid #e5e7eb;font-size:12px;color:#9ca3af;">
            &copy; ${year} ${productName}
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`
}

function renderPlainText(lines: string[]): string {
  return lines.filter(Boolean).join('\n\n')
}

export function renderWelcomeEmail(name: string) {
  const dashboardUrl = getSiteUrl(siteConfig.links.dashboard)
  const subject = `Welcome to ${siteConfig.name}`

  const html = renderEmailLayout({
    preheader: `Your ${siteConfig.name} account is ready — jump into the dashboard.`,
    heading: `Welcome, ${name}`,
    bodyHtml: `
      <p style="margin:0 0 12px;">Your ${escapeHtml(siteConfig.name)} account is ready. You can sign in any time to pick up where you left off.</p>
      <p style="margin:0;">Start with the dashboard — it's the home base for everything in your workspace.</p>
    `.trim(),
    cta: { label: 'Open your dashboard', url: dashboardUrl },
  })

  const text = renderPlainText([
    `Welcome, ${name}`,
    `Your ${siteConfig.name} account is ready. You can sign in any time to keep building.`,
    `Open your dashboard: ${dashboardUrl}`,
    `Need a hand? Reach us at ${siteConfig.creatorEmail}.`,
  ])

  return { subject, html, text }
}

export function renderAdminInviteEmail(name: string, inviter: string) {
  const dashboardUrl = getSiteUrl('/admin')
  const subject = `You were invited to help manage ${siteConfig.name}`

  const html = renderEmailLayout({
    preheader: `${inviter} invited you to the ${siteConfig.name} admin team.`,
    heading: `Hello, ${name}`,
    bodyHtml: `
      <p style="margin:0 0 12px;"><strong>${escapeHtml(inviter)}</strong> invited you to help manage ${escapeHtml(siteConfig.name)} as an administrator.</p>
      <p style="margin:0;">Sign in with this email and you'll see the admin area automatically.</p>
    `.trim(),
    cta: { label: 'Open the admin area', url: dashboardUrl },
  })

  const text = renderPlainText([
    `Hello, ${name}`,
    `${inviter} invited you to help manage ${siteConfig.name} as an administrator.`,
    `Open the admin area: ${dashboardUrl}`,
    `Need a hand? Reach us at ${siteConfig.creatorEmail}.`,
  ])

  return { subject, html, text }
}

export function renderPasswordChangedEmail(name: string) {
  const subject = `Your ${siteConfig.name} password was changed`

  const html = renderEmailLayout({
    preheader: `Security notice for your ${siteConfig.name} account.`,
    heading: 'Password changed',
    bodyHtml: `
      <p style="margin:0 0 12px;">Hi ${escapeHtml(name)}, this confirms your ${escapeHtml(siteConfig.name)} password was just changed.</p>
      <p style="margin:0;">If this wasn't you, reply to this email right away so we can help secure your account.</p>
    `.trim(),
    cta: null,
  })

  const text = renderPlainText([
    `Password changed`,
    `Hi ${name}, this confirms your ${siteConfig.name} password was just changed.`,
    `If this wasn't you, email ${siteConfig.creatorEmail} right away.`,
  ])

  return { subject, html, text }
}

export function renderAccountDeletedEmail(name: string) {
  const subject = `Your ${siteConfig.name} account has been deleted`

  const html = renderEmailLayout({
    preheader: `We've removed your ${siteConfig.name} account.`,
    heading: 'Account deleted',
    bodyHtml: `
      <p style="margin:0 0 12px;">Hi ${escapeHtml(name)}, this message confirms that your ${escapeHtml(siteConfig.name)} account and its data have been deleted.</p>
      <p style="margin:0;">If you ever want to come back, you can sign up again any time.</p>
    `.trim(),
    cta: null,
  })

  const text = renderPlainText([
    `Account deleted`,
    `Hi ${name}, this message confirms your ${siteConfig.name} account has been deleted.`,
    `Questions? Email ${siteConfig.creatorEmail}.`,
  ])

  return { subject, html, text }
}
