import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { requireSession } from '@/lib/auth-helpers'

export const fetchSettingsData = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = await requireSession()

    return {
      id: session.localUser.id,
      email: session.localUser.email,
      name: session.localUser.name ?? '',
      avatarUrl: session.localUser.avatarUrl,
      marketingOptIn: session.localUser.marketingOptIn,
      role: session.localUser.role,
      createdAt: session.localUser.createdAt,
    }
  },
)

export function settingsQueryOptions() {
  return queryOptions({
    queryKey: ['settings'],
    queryFn: () => fetchSettingsData(),
  })
}
