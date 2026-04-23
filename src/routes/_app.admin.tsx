import { useMutation } from '@tanstack/react-query'
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useLocation,
} from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
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

export const Route = createFileRoute('/_app/admin')({
  beforeLoad: ({ context }) => {
    if (context.viewer.localUser.role !== 'super_admin') {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: AdminLayout,
})

function AdminLayout() {
  const location = useLocation()
  const { viewer } = Route.useRouteContext()
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
  const showOverview = location.pathname === '/admin'

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-primary">
            Admin
          </p>
          <h2 className="font-serif text-4xl">Protect the product surface.</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Only the first successful sign-in becomes a super admin, and every
            admin route hangs off this server-backed boundary.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link search={{ page: 1, role: 'all', search: '' }} to="/admin/users">
            Manage users
          </Link>
        </Button>
      </div>

      {showOverview ? (
        <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Admin overview</CardTitle>
              <CardDescription>
                You are signed in as {viewer.localUser.email}.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>
                Use this space to prove out server-backed RBAC, invite flows,
                and user management patterns.
              </p>
              <p>
                Role checks do not depend on hidden links. Non-admin users are
                redirected before the page can render.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Invite an admin</CardTitle>
              <CardDescription>
                This uses the starter notification helper and falls back to
                inline HTML if a template is missing.
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
      ) : (
        <Outlet />
      )}
    </div>
  )
}
