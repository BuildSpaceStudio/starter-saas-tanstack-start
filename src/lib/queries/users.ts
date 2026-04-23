import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { listUsersForAdmin, requireSuperAdmin } from '@/lib/auth-helpers'

const adminUsersInput = z.object({
  page: z.number().int().min(1).default(1),
  search: z.string().default(''),
  role: z.enum(['all', 'member', 'super_admin']).default('all'),
})

export const fetchAdminUsers = createServerFn({ method: 'GET' })
  .inputValidator(adminUsersInput)
  .handler(async ({ data }) => {
    await requireSuperAdmin()
    return listUsersForAdmin({
      page: data.page,
      pageSize: 10,
      role: data.role,
      search: data.search,
    })
  })

export function usersQueryOptions(input: z.infer<typeof adminUsersInput>) {
  return queryOptions({
    queryKey: ['admin-users', input],
    queryFn: () => fetchAdminUsers({ data: input }),
  })
}

export type AdminUsersSearch = z.infer<typeof adminUsersInput>
