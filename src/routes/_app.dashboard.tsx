import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { BarChart3, Sparkles, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { dashboardQueryOptions } from '@/lib/queries/dashboard'
import { formatDate } from '@/lib/utils'

export const Route = createFileRoute('/_app/dashboard')({
  loader: async ({ context }) => {
    return context.queryClient.ensureQueryData(dashboardQueryOptions())
  },
  component: DashboardPage,
})

function DashboardPage() {
  const initialData = Route.useLoaderData()
  const dashboardQuery = useQuery({
    ...dashboardQueryOptions(),
    initialData,
  })

  const data = dashboardQuery.data
  const maxBar = Math.max(...data.chart.map((item) => item.count), 1)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-primary">
            Dashboard
          </p>
          <h2 className="font-serif text-4xl">Your starter control center.</h2>
        </div>
        <Badge variant="outline">TanStack Query prefetched</Badge>
      </div>

      <div className="grid gap-4 xl:grid-cols-4">
        {data.summary.map((item) => (
          <Card key={item.label}>
            <CardHeader className="pb-3">
              <CardDescription>{item.label}</CardDescription>
              <CardTitle className="text-3xl">{item.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{item.detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>New users over the last seven days</CardTitle>
            <CardDescription>
              Starter analytics shape backed by your local `users` table.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex h-64 items-end gap-4">
              {data.chart.map((item) => (
                <div
                  className="flex flex-1 flex-col items-center gap-3"
                  key={item.day}
                >
                  <div className="text-xs text-muted-foreground">
                    {item.count}
                  </div>
                  <div
                    className="w-full rounded-t-3xl bg-primary/80"
                    style={{
                      height: `${Math.max(14, (item.count / maxBar) * 180)}px`,
                    }}
                  />
                  <div className="text-xs text-muted-foreground">
                    {item.day}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Starter highlights</CardTitle>
            <CardDescription>
              A quick reminder of what this template is proving out.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                icon: Sparkles,
                title: 'Hosted auth',
                copy: 'All sign-in and sign-up flows redirect through Buildspace.',
              },
              {
                icon: Users,
                title: 'Admin guardrails',
                copy: 'Role checks are enforced server-side in route boundaries and mutations.',
              },
              {
                icon: BarChart3,
                title: 'Query-driven data',
                copy: 'Dashboard, settings, and admin surfaces share reusable query builders.',
              },
            ].map((item) => {
              const Icon = item.icon

              return (
                <div
                  className="flex gap-4 rounded-[1.5rem] border border-border/70 p-4"
                  key={item.title}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.copy}</p>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
          <CardDescription>
            Placeholder activity assembled from user lifecycle data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Activity</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>When</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.activity.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{formatDate(item.at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
