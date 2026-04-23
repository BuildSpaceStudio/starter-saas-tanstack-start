import { deleteCookie, getCookie } from '@tanstack/react-start/server'
import { asc, count, eq } from 'drizzle-orm'
import { getServerClient } from '@/lib/buildspace/server'
import { db } from '@/lib/db'
import { type UserRecord, users } from '@/lib/db/schema'

export interface RemoteSessionUser {
  id: string
  email: string
  name: string | null
}

export interface AppSession {
  token: string
  remoteUser: RemoteSessionUser
  localUser: UserRecord
  isNewUser: boolean
}

function parseCookieHeader(header: string | null) {
  if (!header) {
    return {}
  }

  return Object.fromEntries(
    header
      .split(';')
      .map((segment) => segment.trim())
      .filter(Boolean)
      .map((segment) => {
        const [name, ...rest] = segment.split('=')
        return [name, decodeURIComponent(rest.join('='))]
      }),
  )
}

export function getSessionCookieName() {
  return process.env.SESSION_COOKIE_NAME || 'bs_session'
}

export function getAppUrl() {
  return process.env.APP_URL || 'http://localhost:3000'
}

export function readSessionToken(request?: Request) {
  if (request) {
    const cookies = parseCookieHeader(request.headers.get('cookie'))
    return cookies[getSessionCookieName()]
  }

  return getCookie(getSessionCookieName())
}

export function clearSessionCookie() {
  deleteCookie(getSessionCookieName(), {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  })
}

export async function ensureLocalUser(remoteUser: RemoteSessionUser) {
  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.buildspaceUserId, remoteUser.id))
    .limit(1)

  if (existingUser) {
    const [updatedUser] = await db
      .update(users)
      .set({
        email: remoteUser.email,
        name: remoteUser.name,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(users.id, existingUser.id))
      .returning()

    return {
      user: updatedUser ?? existingUser,
      created: false,
    }
  }

  const countRows = await db.select({ total: count() }).from(users)
  const total = countRows[0]?.total ?? 0
  const [createdUser] = await db
    .insert(users)
    .values({
      buildspaceUserId: remoteUser.id,
      email: remoteUser.email,
      name: remoteUser.name,
      role: total === 0 ? 'super_admin' : 'member',
    })
    .returning()

  if (!createdUser) {
    throw new Error('Failed to create local user record.')
  }

  return {
    user: createdUser,
    created: true,
  }
}

export async function getSession(
  request?: Request,
): Promise<AppSession | null> {
  const token = readSessionToken(request)

  if (!token) {
    return null
  }

  const remoteSession = await getServerClient().auth.getSession(token)

  if (!remoteSession?.user) {
    return null
  }

  const { user: localUser, created } = await ensureLocalUser(remoteSession.user)

  return {
    token,
    remoteUser: remoteSession.user,
    localUser,
    isNewUser: created,
  }
}

export async function requireSession(request?: Request) {
  const session = await getSession(request)

  if (!session) {
    throw new Error('UNAUTHORIZED')
  }

  return session
}

export async function requireSuperAdmin(request?: Request) {
  const session = await requireSession(request)

  if (session.localUser.role !== 'super_admin') {
    throw new Error('FORBIDDEN')
  }

  return session
}

export async function listUsersForAdmin({
  search,
  role,
  page,
  pageSize,
}: {
  search?: string
  role?: 'all' | 'member' | 'super_admin'
  page: number
  pageSize: number
}) {
  const allUsers = await db.select().from(users).orderBy(asc(users.createdAt))

  const filteredUsers = allUsers.filter((user) => {
    const matchesSearch =
      !search ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      (user.name ?? '').toLowerCase().includes(search.toLowerCase())
    const matchesRole = !role || role === 'all' || user.role === role

    return matchesSearch && matchesRole
  })

  const offset = (page - 1) * pageSize

  return {
    users: filteredUsers.slice(offset, offset + pageSize),
    total: filteredUsers.length,
    counts: {
      all: allUsers.length,
      member: allUsers.filter((user) => user.role === 'member').length,
      superAdmin: allUsers.filter((user) => user.role === 'super_admin').length,
    },
  }
}

export async function countSuperAdmins() {
  const rows = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.role, 'super_admin'))

  return rows.length
}
