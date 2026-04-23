import { createFileRoute } from '@tanstack/react-router'
import {
  ArrowUpRight,
  CreditCard,
  DollarSign,
  ShoppingCart,
  Users,
} from 'lucide-react'
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

const summary = [
  {
    label: 'Total revenue',
    value: '$45,231.89',
    hint: 'Sample data for layout preview',
    icon: DollarSign,
    trend: '+12.5% vs last month',
  },
  {
    label: 'Subscriptions',
    value: '+2,350',
    hint: 'Active billed seats (demo)',
    icon: Users,
    trend: '+4.3% vs last month',
  },
  {
    label: 'Sales',
    value: '+12,234',
    hint: 'Orders this period (demo)',
    icon: ShoppingCart,
    trend: '+9.1% vs last month',
  },
  {
    label: 'Active now',
    value: '573',
    hint: 'Simulated concurrent users',
    icon: CreditCard,
    trend: '+201 since last hour',
  },
]

const revenueByDay = [
  { day: 'Mon', amount: 3200 },
  { day: 'Tue', amount: 4100 },
  { day: 'Wed', amount: 3800 },
  { day: 'Thu', amount: 5200 },
  { day: 'Fri', amount: 4900 },
  { day: 'Sat', amount: 3600 },
  { day: 'Sun', amount: 4300 },
]

const recentOrders = [
  {
    id: 'ORD-7352',
    customer: 'Alex Morgan',
    channel: 'Web checkout',
    amount: '$249.00',
    status: 'Paid',
  },
  {
    id: 'ORD-7351',
    customer: 'Riverdale Co.',
    channel: 'Invoice',
    amount: '$1,180.00',
    status: 'Paid',
  },
  {
    id: 'ORD-7350',
    customer: 'Jamie Chen',
    channel: 'Mobile',
    amount: '$89.00',
    status: 'Pending',
  },
  {
    id: 'ORD-7349',
    customer: 'Northwind Labs',
    channel: 'Web checkout',
    amount: '$512.40',
    status: 'Paid',
  },
]

export const Route = createFileRoute('/_app/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const maxBar = Math.max(...revenueByDay.map((d) => d.amount), 1)

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-primary/[0.04]">
        <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              Sample dashboard
            </p>
            <p className="text-sm text-muted-foreground">
              The numbers and chart below are placeholder content so you can see
              a typical layout. Replace this page with your real product
              metrics, data sources, and charts when you are ready.
            </p>
          </div>
          <Badge variant="secondary">Demo data</Badge>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-primary">
            Overview
          </p>
          <h2 className="font-serif text-4xl">Welcome back</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            A simple KPI grid, trend chart, and recent activity—similar to the
            patterns in{' '}
            <a
              className="font-medium text-primary underline-offset-4 hover:underline"
              href="https://ui.shadcn.com/blocks"
              rel="noreferrer"
              target="_blank"
            >
              shadcn/ui blocks
            </a>
            .
          </p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-4">
        {summary.map((item) => {
          const Icon = item.icon
          return (
            <Card key={item.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {item.label}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-3xl font-semibold tracking-tight">
                  {item.value}
                </p>
                <p className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                  <ArrowUpRight className="h-3 w-3" />
                  {item.trend}
                </p>
                <p className="text-xs text-muted-foreground">{item.hint}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue by day</CardTitle>
          <CardDescription>
            Illustrative bar chart—swap for your analytics provider or API.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-56 items-end gap-3 sm:gap-4">
            {revenueByDay.map((item) => (
              <div
                className="flex flex-1 flex-col items-center gap-2"
                key={item.day}
              >
                <div className="text-xs text-muted-foreground">
                  ${(item.amount / 1000).toFixed(1)}k
                </div>
                <div
                  className="w-full rounded-t-2xl bg-primary/80"
                  style={{
                    height: `${Math.max(12, (item.amount / maxBar) * 160)}px`,
                  }}
                />
                <div className="text-xs text-muted-foreground">{item.day}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent orders</CardTitle>
          <CardDescription>
            Fictional transactions to show a compact table pattern.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.id}</TableCell>
                  <TableCell>{row.customer}</TableCell>
                  <TableCell>{row.channel}</TableCell>
                  <TableCell className="text-right">{row.amount}</TableCell>
                  <TableCell>{row.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
