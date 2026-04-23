import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { countSuperAdmins, requireSuperAdmin } from '@/lib/auth-helpers'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { trackServerWithSession } from '@/lib/events'
import { sendAdminInviteEmail } from '@/lib/notifications'

export const updateUserRole = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      userId: z.string().min(1),
      role: z.enum(['member', 'super_admin']),
    }),
  )
  .handler(async ({ data }) => {
    const session = await requireSuperAdmin()
    const [targetUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, data.userId))
      .limit(1)

    if (!targetUser) {
      throw new Error('User not found.')
    }

    if (data.userId === session.localUser.id && data.role === 'member') {
      throw new Error(
        'You cannot change your own role to member. Ask another super admin to update your access if needed.',
      )
    }

    if (targetUser.role === 'super_admin' && data.role === 'member') {
      const superAdminCount = await countSuperAdmins()
      if (superAdminCount <= 1) {
        throw new Error('At least one super admin must remain.')
      }
    }

    const [updatedUser] = await db
      .update(users)
      .set({
        role: data.role,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(users.id, targetUser.id))
      .returning()

    await trackServerWithSession(
      session.token,
      'admin:user-role-updated',
      {
        targetRole: data.role,
      },
      session.localUser.id,
    )

    return updatedUser
  })

export const sendAdminInvite = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      email: z.string().email(),
      name: z.string().min(1).max(80),
    }),
  )
  .handler(async ({ data }) => {
    const session = await requireSuperAdmin()

    await sendAdminInviteEmail({
      to: data.email,
      name: data.name,
      inviter: session.localUser.name ?? session.localUser.email,
    })

    await trackServerWithSession(
      session.token,
      'admin:user-role-updated',
      {
        targetRole: 'invited_admin',
      },
      session.localUser.id,
    )

    return { success: true }
  })
