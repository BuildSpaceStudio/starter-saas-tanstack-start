import { useMutation, useQuery } from '@tanstack/react-query'
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useLocation,
} from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import { AdminWorkspaceMetrics } from '@/components/app/admin-workspace-metrics'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { sendAdminInvite } from '@/lib/mutations/admin'
import { dashboardQueryOptions } from '@/lib/queries/dashboard'

export const Route = createFileRoute('/_app/admin')({
  beforeLoad: ({ context }) => {
    if (context.viewer.localUser.role !== 'super_admin') {
      throw redirect({ to: '/dashboard' })
    }
  },
  loader: async ({ context }) => {
    return context.queryClient.ensureQueryData(dashboardQueryOptions())
  },
  component: AdminLayout,
})

function AdminLayout() {
  const location = useLocation()
  const { viewer } = Route.useRouteContext()
  const showOverview = location.pathname === '/admin'
  const dashboardInitial = Route.useLoaderData()
  const dashboardQuery = useQuery({
    ...dashboardQueryOptions(),
    initialData: dashboardInitial,
    enabled: showOverview,
  })
  const [inviteName, setInviteName] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const inviteMutation = useMutation({
    mutationFn: sendAdminInvite,
    onSuccess: () => {
      toast.success('Admin invite sent.')
      setInviteName('')
      setInviteEmail('')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-primary">
            Admin
          </p>
          <h2 className="font-serif text-4xl">Super admin tools</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Monitor workspace membership, review activity, and invite other
            admins. Only super admins can open this area.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link search={{ page: 1, role: 'all', search: '' }} to="/admin/users">
            Manage users
          </Link>
        </Button>
      </div>

      {showOverview ? (
        <>
          <AdminWorkspaceMetrics data={dashboardQuery.data} />

          <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
            <Card>
              <CardHeader>
                <CardTitle>Signed in</CardTitle>
                <CardDescription>
                  You are signed in as {viewer.localUser.email}.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>
                  The first account in a fresh environment becomes super admin.
                  Use “Manage users” to search, filter, and update roles.
                </p>
                <p>
                  Anyone without this role is sent back to the main dashboard if
                  they try to open admin URLs directly.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Invite an admin</CardTitle>
                <CardDescription>
                  Sends an email invitation with a link to join as an
                  administrator.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  className="space-y-4"
                  onSubmit={(event) => {
                    event.preventDefault()
                    inviteMutation.mutate({
                      data: {
                        email: inviteEmail,
                        name: inviteName,
                      },
                    })
                  }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="invite-name">Name</Label>
                    <Input
                      id="invite-name"
                      onChange={(event) => setInviteName(event.target.value)}
                      value={inviteName}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="invite-email">Email</Label>
                    <Input
                      id="invite-email"
                      onChange={(event) => setInviteEmail(event.target.value)}
                      type="email"
                      value={inviteEmail}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button disabled={inviteMutation.isPending} type="submit">
                      {inviteMutation.isPending
                        ? 'Sending...'
                        : 'Send admin invite'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <Outlet />
      )}
    </div>
  )
}
