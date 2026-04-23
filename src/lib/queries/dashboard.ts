import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { requireSession } from '@/lib/auth-helpers'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'

export interface DashboardData {
  summary: Array<{
    label: string
    value: string
    detail: string
  }>
  chart: Array<{
    day: string
    count: number
  }>
  activity: Array<{
    id: string
    title: string
    description: string
    at: string
  }>
}

function buildSignupChart(createdAtValues: string[]) {
  const formatter = new Intl.DateTimeFormat('en-US', { weekday: 'short' })
  const today = new Date()

  return Array.from({ length: 7 }, (_, index) => {
    const current = new Date(today)
    current.setDate(today.getDate() - (6 - index))
    const currentDay = current.toISOString().slice(0, 10)
    const count = createdAtValues.filter((value) =>
      value.startsWith(currentDay),
    ).length

    return {
      day: formatter.format(current),
      count,
    }
  })
}

export const fetchDashboardData = createServerFn({ method: 'GET' }).handler(
  async (): Promise<DashboardData> => {
    const session = await requireSession()
    const allUsers = await db.select().from(users)
    const superAdminCount = allUsers.filter(
      (user) => user.role === 'super_admin',
    ).length
    const optedInCount = allUsers.filter((user) => user.marketingOptIn).length
    const chart = buildSignupChart(allUsers.map((user) => user.createdAt))
    const activity = allUsers
      .slice()
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
      .slice(0, 6)
      .map((user) => ({
        id: user.id,
        title:
          user.id === session.localUser.id
            ? 'You updated your workspace'
            : `${user.name ?? 'A teammate'} joined the app`,
        description:
          user.id === session.localUser.id
            ? `Role: ${session.localUser.role.replace('_', ' ')}`
            : `${user.email} created an account`,
        at: user.updatedAt,
      }))

    return {
      summary: [
        {
          label: 'Active members',
          value: `${allUsers.length}`,
          detail: 'Total local users in this environment',
        },
        {
          label: 'Super admins',
          value: `${superAdminCount}`,
          detail: 'Server-enforced admin access',
        },
        {
          label: 'Marketing opt-in',
          value: `${allUsers.length === 0 ? 0 : Math.round((optedInCount / allUsers.length) * 100)}%`,
          detail: 'Users who opted into future marketing mail',
        },
        {
          label: 'Your role',
          value:
            session.localUser.role === 'super_admin' ? 'Super admin' : 'Member',
          detail: 'Assigned on first successful sign-in',
        },
      ],
      chart,
      activity,
    }
  },
)

export function dashboardQueryOptions() {
  return queryOptions({
    queryKey: ['dashboard'],
    queryFn: () => fetchDashboardData(),
  })
}
