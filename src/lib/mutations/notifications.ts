import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { requireSession } from '@/lib/auth-helpers'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { trackServerWithSession } from '@/lib/events'

export const updateNotificationPreferences = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      marketingOptIn: z.boolean(),
    }),
  )
  .handler(async ({ data }) => {
    const session = await requireSession()
    const [updatedUser] = await db
      .update(users)
      .set({
        marketingOptIn: data.marketingOptIn,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(users.id, session.localUser.id))
      .returning()

    await trackServerWithSession(
      session.token,
      'settings:notifications-saved',
      {
        marketingOptIn: data.marketingOptIn,
      },
      session.localUser.id,
    )

    return updatedUser
  })
