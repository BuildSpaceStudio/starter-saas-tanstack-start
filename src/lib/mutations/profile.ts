import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { requireSession } from '@/lib/auth-helpers'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { trackServerWithSession } from '@/lib/events'

const profileInput = z.object({
  name: z.string().min(1).max(80),
  avatarUrl: z.string().url().nullable().optional(),
})

export const updateProfile = createServerFn({ method: 'POST' })
  .inputValidator(profileInput)
  .handler(async ({ data }) => {
    const session = await requireSession()
    const [updatedUser] = await db
      .update(users)
      .set({
        name: data.name,
        avatarUrl: data.avatarUrl ?? null,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(users.id, session.localUser.id))
      .returning()

    await trackServerWithSession(
      session.token,
      'settings:profile-saved',
      {
        hasAvatar: Boolean(data.avatarUrl),
      },
      session.localUser.id,
    )

    return updatedUser
  })
