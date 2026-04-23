import { beforeEach, describe, expect, it, mock } from 'bun:test'

type MockUser = {
  id: string
  buildspaceUserId: string
  email: string
  name: string | null
  avatarUrl: string | null
  role: 'member' | 'super_admin'
  marketingOptIn: boolean
  createdAt: string
  updatedAt: string
}

const cookieState = {
  value: undefined as string | undefined,
}

const buildspaceState = {
  authGetSession: async (_token: string) =>
    null as null | { user: { id: string; email: string; name: string | null } },
  trackEvent: async (
    _event: unknown,
    _properties?: unknown,
    _actorId?: unknown,
  ) => ({ event_id: 'evt_123' }),
}

function createDbMock() {
  const state = {
    users: [] as MockUser[],
    lookupUser: null as MockUser | null,
  }

  return {
    state,
    select(shape?: Record<string, unknown>) {
      if (shape && 'total' in shape) {
        return {
          from: async () => [{ total: state.users.length }],
        }
      }

      if (shape && 'id' in shape) {
        return {
          from: () => ({
            where: async () =>
              state.users
                .filter((user) => user.role === 'super_admin')
                .map((user) => ({ id: user.id })),
          }),
        }
      }

      return {
        from: () => ({
          where: () => ({
            limit: async () => (state.lookupUser ? [state.lookupUser] : []),
          }),
          orderBy: async () => state.users.slice(),
        }),
      }
    },
    insert() {
      return {
        values(values: Partial<MockUser>) {
          return {
            returning: async () => {
              const createdUser: MockUser = {
                id: values.id ?? crypto.randomUUID(),
                buildspaceUserId: values.buildspaceUserId ?? '',
                email: values.email ?? '',
                name: values.name ?? null,
                avatarUrl: values.avatarUrl ?? null,
                role: values.role ?? 'member',
                marketingOptIn: values.marketingOptIn ?? false,
                createdAt: values.createdAt ?? new Date().toISOString(),
                updatedAt: values.updatedAt ?? new Date().toISOString(),
              }

              state.users.push(createdUser)
              return [createdUser]
            },
          }
        },
      }
    },
    update() {
      return {
        set(values: Partial<MockUser>) {
          return {
            where: () => ({
              returning: async () => {
                const currentUser = state.users[0]

                if (!currentUser) {
                  return []
                }

                const updatedUser = {
                  ...currentUser,
                  ...values,
                }

                state.users[0] = updatedUser
                return [updatedUser]
              },
            }),
          }
        },
      }
    },
  }
}

const dbMock = createDbMock()

mock.module('@tanstack/react-start/server', () => ({
  deleteCookie: () => undefined,
  getCookie: () => cookieState.value,
  setCookie: () => undefined,
}))

mock.module('@/lib/buildspace/server', () => ({
  getServerClient: () => ({
    auth: {
      getSession: (token: string) => buildspaceState.authGetSession(token),
      handleCallback: async () => {
        throw new Error('Not used in tests')
      },
      revokeSession: async () => undefined,
    },
    events: {
      track: (event: unknown, properties?: unknown, actorId?: unknown) =>
        buildspaceState.trackEvent(event, properties, actorId),
    },
    notifications: {
      send: async () => ({ id: 'note_123' }),
      sendTemplate: async () => ({ id: 'note_123' }),
    },
    clearSession: () => undefined,
    setSession: () => undefined,
  }),
}))

mock.module('@/lib/db', () => ({
  db: dbMock,
}))

const authHelpers = await import('@/lib/auth-helpers')
const { trackServer } = await import('@/lib/events')
const { updateProfile } = await import('@/lib/mutations/profile')

beforeEach(() => {
  cookieState.value = undefined
  dbMock.state.users = []
  dbMock.state.lookupUser = null
  buildspaceState.authGetSession = async () => null
  buildspaceState.trackEvent = async () => ({ event_id: 'evt_123' })
})

describe('starter auth helpers', () => {
  it('getSession returns null when no cookie is set', async () => {
    await expect(authHelpers.getSession()).resolves.toBeNull()
  })

  it('ensureLocalUser assigns super_admin when the table is empty', async () => {
    const result = await authHelpers.ensureLocalUser({
      id: 'bs_1',
      email: 'first@example.com',
      name: 'First User',
    })

    expect(result.created).toBeTrue()
    expect(result.user.role).toBe('super_admin')
  })

  it('ensureLocalUser assigns member when another user already exists', async () => {
    dbMock.state.users.push({
      id: 'local_1',
      buildspaceUserId: 'bs_existing',
      email: 'existing@example.com',
      name: 'Existing User',
      avatarUrl: null,
      role: 'super_admin',
      marketingOptIn: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    const result = await authHelpers.ensureLocalUser({
      id: 'bs_2',
      email: 'second@example.com',
      name: 'Second User',
    })

    expect(result.created).toBeTrue()
    expect(result.user.role).toBe('member')
  })
})

describe('starter events and guards', () => {
  it('trackServer never throws when the SDK rejects', async () => {
    buildspaceState.trackEvent = async () => {
      throw new Error('tracking failed')
    }

    await expect(trackServer('dashboard:viewed')).resolves.toBeUndefined()
  })

  it('an auth-required server function rejects when unauthenticated', async () => {
    await expect(
      updateProfile({
        data: {
          name: 'No Session',
          avatarUrl: null,
        },
      }),
    ).rejects.toThrow('UNAUTHORIZED')
  })

  it('admin role checks reject non-admin callers', async () => {
    cookieState.value = 'token_123'
    dbMock.state.users = [
      {
        id: 'local_1',
        buildspaceUserId: 'bs_member',
        email: 'member@example.com',
        name: 'Member User',
        avatarUrl: null,
        role: 'member',
        marketingOptIn: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
    dbMock.state.lookupUser = dbMock.state.users[0] ?? null
    buildspaceState.authGetSession = async () => ({
      user: {
        id: 'bs_member',
        email: 'member@example.com',
        name: 'Member User',
      },
    })

    await expect(authHelpers.requireSuperAdmin()).rejects.toThrow('FORBIDDEN')
  })
})
