import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { updateUserRole } from '@/lib/mutations/admin'
import { type AdminUsersSearch, usersQueryOptions } from '@/lib/queries/users'
import { formatDate } from '@/lib/utils'

function normalizeSearch(search: Record<string, unknown>): AdminUsersSearch {
  return {
    page:
      typeof search.page === 'number'
        ? Math.max(1, Math.floor(search.page))
        : 1,
    search: typeof search.search === 'string' ? search.search : '',
    role:
      search.role === 'member' || search.role === 'super_admin'
        ? search.role
        : 'all',
  }
}

export const Route = createFileRoute('/_app/admin/users')({
  validateSearch: normalizeSearch,
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => {
    return context.queryClient.ensureQueryData(usersQueryOptions(deps))
  },
  component: AdminUsersPage,
})

function AdminUsersPage() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  const queryClient = useQueryClient()
  const initialData = Route.useLoaderData()
  const usersQuery = useQuery({
    ...usersQueryOptions(search),
    initialData,
  })

  const roleMutation = useMutation({
    mutationFn: updateUserRole,
    onSuccess: async () => {
      toast.success('User role updated.')
      await queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const totalPages = Math.max(1, Math.ceil(usersQuery.data.total / 10))

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <CardTitle>User management</CardTitle>
            <CardDescription>
              Search params power the admin table state so filters stay
              shareable and router-native.
            </CardDescription>
          </div>
          <Button asChild variant="ghost">
            <Link to="/admin">Back to admin overview</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 md:grid-cols-[1fr_12rem]">
          <Input
            onChange={(event) =>
              navigate({
                search: (previous) => ({
                  ...previous,
                  page: 1,
                  search: event.target.value,
                }),
              })
            }
            placeholder="Search by name or email"
            value={search.search}
          />
          <Select
            onChange={(event) =>
              navigate({
                search: (previous) => ({
                  ...previous,
                  page: 1,
                  role: event.target.value as AdminUsersSearch['role'],
                }),
              })
            }
            value={search.role}
          >
            <option value="all">All roles</option>
            <option value="member">Members</option>
            <option value="super_admin">Super admins</option>
          </Select>
        </div>

        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <Badge variant="outline">All: {usersQuery.data.counts.all}</Badge>
          <Badge variant="outline">
            Super admins: {usersQuery.data.counts.superAdmin}
          </Badge>
          <Badge variant="outline">
            Members: {usersQuery.data.counts.member}
          </Badge>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usersQuery.data.users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{user.name ?? 'Unnamed user'}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      user.role === 'super_admin' ? 'default' : 'secondary'
                    }
                  >
                    {user.role === 'super_admin' ? 'Super admin' : 'Member'}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    disabled={roleMutation.isPending}
                    onClick={() =>
                      roleMutation.mutate({
                        data: {
                          userId: user.id,
                          role:
                            user.role === 'super_admin'
                              ? 'member'
                              : 'super_admin',
                        },
                      })
                    }
                    size="sm"
                    variant="outline"
                  >
                    Make{' '}
                    {user.role === 'super_admin' ? 'member' : 'super admin'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {search.page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              disabled={search.page <= 1}
              onClick={() =>
                navigate({
                  search: (previous) => ({
                    ...previous,
                    page: Math.max(1, previous.page - 1),
                  }),
                })
              }
              size="sm"
              variant="outline"
            >
              Previous
            </Button>
            <Button
              disabled={search.page >= totalPages}
              onClick={() =>
                navigate({
                  search: (previous) => ({
                    ...previous,
                    page: Math.min(totalPages, previous.page + 1),
                  }),
                })
              }
              size="sm"
              variant="outline"
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
