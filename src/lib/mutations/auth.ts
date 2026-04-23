import { createServerFn } from '@tanstack/react-start'
import { setCookie } from '@tanstack/react-start/server'
import { z } from 'zod'
import { getServerClient } from '@/lib/buildspace/server'
import { trackServer } from '@/lib/events'
import { sendWelcomeEmail } from '@/lib/notifications'

export const completeAuthCallback = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      requestUrl: z.string().url(),
    }),
  )
  .handler(async ({ data }) => {
    const { ensureLocalUser, getAppUrl, getSessionCookieName } = await import(
      '@/lib/auth-helpers'
    )
    const redirectUri = `${getAppUrl()}/auth/callback`
    const { access_token, expires_in, user } =
      await getServerClient().auth.handleCallback(data.requestUrl, {
        redirectUri,
      })

    setCookie(getSessionCookieName(), access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: expires_in,
      path: '/',
    })

    const { user: localUser, created } = await ensureLocalUser(user)

    if (created) {
      await sendWelcomeEmail({
        to: user.email,
        name: user.name ?? user.email,
      })
      await trackServer(
        'user:signed-up',
        { role: localUser.role },
        localUser.id,
      )
    }

    await trackServer('user:signed-in', { role: localUser.role }, localUser.id)

    return { redirectTo: '/dashboard' }
  })

export const signOut = createServerFn({ method: 'POST' }).handler(async () => {
  const { clearSessionCookie, readSessionToken } = await import(
    '@/lib/auth-helpers'
  )
  const token = readSessionToken()

  if (token) {
    await getServerClient().auth.revokeSession(token)
  }

  clearSessionCookie()

  return { redirectTo: '/' }
})
