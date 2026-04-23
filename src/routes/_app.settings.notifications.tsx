import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
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
import { updateNotificationPreferences } from '@/lib/mutations/notifications'
import { settingsQueryOptions } from '@/lib/queries/settings'

export const Route = createFileRoute('/_app/settings/notifications')({
  component: NotificationsSettingsPage,
})

function NotificationsSettingsPage() {
  const queryClient = useQueryClient()
  const settingsQuery = useQuery(settingsQueryOptions())
  const [marketingOptIn, setMarketingOptIn] = useState(
    settingsQuery.data?.marketingOptIn ?? false,
  )

  const mutation = useMutation({
    mutationFn: updateNotificationPreferences,
    onSuccess: async () => {
      toast.success('Notification preferences saved.')
      await queryClient.invalidateQueries({
        queryKey: settingsQueryOptions().queryKey,
      })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          Transactional emails always send. This toggle is for future marketing
          mail only.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <label className="flex items-start gap-4 rounded-[1.5rem] border border-border/70 p-5">
          <input
            checked={marketingOptIn}
            className="mt-1 h-4 w-4 rounded border-input"
            onChange={(event) => setMarketingOptIn(event.target.checked)}
            type="checkbox"
          />
          <div className="space-y-1">
            <p className="font-medium">Opt into future product updates</p>
            <p className="text-sm text-muted-foreground">
              Promotional or lifecycle marketing should respect this preference.
              Account and security emails do not depend on it.
            </p>
          </div>
        </label>
        <div className="flex justify-end">
          <Button
            disabled={mutation.isPending}
            onClick={() =>
              mutation.mutate({
                data: {
                  marketingOptIn,
                },
              })
            }
          >
            {mutation.isPending ? 'Saving...' : 'Save preferences'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
