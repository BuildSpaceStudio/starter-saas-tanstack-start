import { BarChart3, ShieldCheck, Sparkles, Users } from 'lucide-react'
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
import type { DashboardData } from '@/lib/queries/dashboard'
import { formatDate } from '@/lib/utils'

export function AdminWorkspaceMetrics({ data }: { data: DashboardData }) {
  const maxBar = Math.max(...data.chart.map((item) => item.count), 1)

  return (
    <div className="space-y-6">
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
            <CardTitle>New members (last 7 days)</CardTitle>
            <CardDescription>
              Sign-ups grouped by day for a quick sanity check.
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
            <CardTitle>Admin checklist</CardTitle>
            <CardDescription>
              Common tasks as you grow beyond the first account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                icon: Sparkles,
                title: 'Review access',
                copy: 'Confirm who has super admin access and invite teammates from user management.',
              },
              {
                icon: Users,
                title: 'Invite your team',
                copy: 'Provision accounts early so roles and permissions match how you ship.',
              },
              {
                icon: BarChart3,
                title: 'Watch sign-up trends',
                copy: 'Use the chart and table below to spot spikes or quiet periods.',
              },
              {
                icon: ShieldCheck,
                title: 'Protect sensitive routes',
                copy: 'Non-admins are redirected before admin pages render.',
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
          <CardTitle>Recent member activity</CardTitle>
          <CardDescription>
            Latest updates from your user records, newest first.
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
