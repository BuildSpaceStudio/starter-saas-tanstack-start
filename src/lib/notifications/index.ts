import { getServerClient } from '@/lib/buildspace/server'
import {
  notificationTemplateSlugs,
  renderAccountDeletedEmail,
  renderAdminInviteEmail,
  renderPasswordChangedEmail,
  renderWelcomeEmail,
} from './templates'

type Recipient = string | string[]

async function sendTemplateWithFallback({
  templateSlug,
  to,
  variables,
  fallback,
  metadata,
}: {
  templateSlug: string
  to: Recipient
  variables?: Record<string, string>
  fallback: {
    subject: string
    html: string
    text: string
  }
  metadata?: Record<string, string>
}) {
  const client = getServerClient()

  try {
    return await client.notifications.sendTemplate(templateSlug, {
      to,
      variables,
      metadata,
    })
  } catch {
    return client.notifications.send({
      to,
      subject: fallback.subject,
      html: fallback.html,
      text: fallback.text,
      metadata,
    })
  }
}

export async function sendWelcomeEmail({
  to,
  name,
}: {
  to: Recipient
  name: string
}) {
  return sendTemplateWithFallback({
    templateSlug: notificationTemplateSlugs.welcome,
    to,
    variables: { name },
    fallback: renderWelcomeEmail(name),
    metadata: { template: notificationTemplateSlugs.welcome },
  })
}

export async function sendAdminInviteEmail({
  to,
  name,
  inviter,
}: {
  to: Recipient
  name: string
  inviter: string
}) {
  return sendTemplateWithFallback({
    templateSlug: notificationTemplateSlugs.adminInvite,
    to,
    variables: { name, inviter },
    fallback: renderAdminInviteEmail(name, inviter),
    metadata: { template: notificationTemplateSlugs.adminInvite },
  })
}

export async function sendPasswordChangedEmail({
  to,
  name,
}: {
  to: Recipient
  name: string
}) {
  return sendTemplateWithFallback({
    templateSlug: notificationTemplateSlugs.passwordChanged,
    to,
    variables: { name },
    fallback: renderPasswordChangedEmail(name),
    metadata: { template: notificationTemplateSlugs.passwordChanged },
  })
}

export async function sendAccountDeletedEmail({
  to,
  name,
}: {
  to: Recipient
  name: string
}) {
  return sendTemplateWithFallback({
    templateSlug: notificationTemplateSlugs.accountDeleted,
    to,
    variables: { name },
    fallback: renderAccountDeletedEmail(name),
    metadata: { template: notificationTemplateSlugs.accountDeleted },
  })
}
