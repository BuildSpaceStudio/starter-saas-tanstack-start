import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createFileRoute,
  Link,
  Outlet,
  useLocation,
} from '@tanstack/react-router'
import type * as React from 'react'
import { useState } from 'react'
import { toast } from 'sonner'
import { UserAvatar } from '@/components/ui/avatar'
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getBrowserClient } from '@/lib/buildspace/client'
import { updateProfile } from '@/lib/mutations/profile'
import { dashboardQueryOptions } from '@/lib/queries/dashboard'
import { settingsQueryOptions } from '@/lib/queries/settings'

export const Route = createFileRoute('/_app/settings')({
  loader: async ({ context }) => {
    return context.queryClient.ensureQueryData(settingsQueryOptions())
  },
  component: SettingsPage,
})

function SettingsPage() {
  const location = useLocation()
  const queryClient = useQueryClient()
  const initialData = Route.useLoaderData()
  const settingsQuery = useQuery({
    ...settingsQueryOptions(),
    initialData,
  })
  const [name, setName] = useState(initialData.name)
  const [avatarUrl, setAvatarUrl] = useState(initialData.avatarUrl)
  const isNotificationsRoute = location.pathname.endsWith('/notifications')

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: async () => {
      toast.success('Profile saved.')
      await queryClient.invalidateQueries({
        queryKey: settingsQueryOptions().queryKey,
      })
      await queryClient.invalidateQueries({
        queryKey: dashboardQueryOptions().queryKey,
      })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  async function handleAvatarChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    try {
      const upload = await getBrowserClient().storage.upload(file, {
        path: `avatars/${Date.now()}-${file.name}`,
      })

      setAvatarUrl(upload.url)
      toast.success('Avatar uploaded. Save profile to persist the change.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload failed.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-primary">
            Settings
          </p>
          <h2 className="font-serif text-4xl">Shape the account experience.</h2>
        </div>
      </div>

      <Tabs value={isNotificationsRoute ? 'notifications' : 'profile'}>
        <TabsList>
          <TabsTrigger asChild value="profile">
            <Link to="/settings">Profile</Link>
          </TabsTrigger>
          <TabsTrigger asChild value="notifications">
            <Link to="/settings/notifications">Notifications</Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {isNotificationsRoute ? (
        <Outlet />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              This mutation runs through a server function and invalidates the
              settings and dashboard caches.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="space-y-4 rounded-[1.75rem] border border-border/70 p-5">
              <UserAvatar name={name} src={avatarUrl} />
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">
                  {settingsQuery.data.email}
                </p>
                <p>
                  {settingsQuery.data.role === 'super_admin'
                    ? 'Super admin'
                    : 'Member'}
                </p>
              </div>
              <Label htmlFor="avatar">Avatar upload</Label>
              <Input id="avatar" onChange={handleAvatarChange} type="file" />
            </div>
            <form
              className="space-y-5"
              onSubmit={(event) => {
                event.preventDefault()
                updateProfileMutation.mutate({
                  data: {
                    name,
                    avatarUrl,
                  },
                })
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="name">Display name</Label>
                <Input
                  id="name"
                  onChange={(event) => setName(event.target.value)}
                  value={name}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input disabled id="email" value={settingsQuery.data.email} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="created-at">First seen</Label>
                <Input
                  disabled
                  id="created-at"
                  value={settingsQuery.data.createdAt}
                />
              </div>
              <div className="flex justify-end">
                <Button
                  disabled={updateProfileMutation.isPending}
                  type="submit"
                >
                  {updateProfileMutation.isPending
                    ? 'Saving...'
                    : 'Save profile'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
