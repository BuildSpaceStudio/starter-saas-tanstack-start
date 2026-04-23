import { useMutation } from '@tanstack/react-query'
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useLocation,
} from '@tanstack/react-router'
import {
  ChevronsUpDown,
  Home,
  Moon,
  Settings,
  Shield,
  SunMedium,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { UserAvatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sidebar } from '@/components/ui/sidebar'
import { fetchViewer } from '@/lib/auth'
import { signOut } from '@/lib/mutations/auth'

export const Route = createFileRoute('/_app')({
  beforeLoad: async () => {
    const viewer = await fetchViewer()

    if (!viewer) {
      throw redirect({ to: '/' })
    }

    return { viewer }
  },
  component: AppLayout,
})

function AppLayout() {
  const location = useLocation()
  const { viewer } = Route.useRouteContext()
  const signOutMutation = useMutation({
    mutationFn: signOut,
    onSuccess: ({ redirectTo }) => {
      window.location.href = redirectTo
    },
  })

  const items = [
    { label: 'Dashboard', to: '/dashboard', icon: Home },
    { label: 'Settings', to: '/settings', icon: Settings },
  ]

  if (viewer.localUser.role === 'super_admin') {
    items.push({ label: 'Admin', to: '/admin', icon: Shield })
  }

  const accountMenu = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex w-full items-center gap-3 rounded-xl border border-sidebar-border bg-sidebar-accent/40 px-3 py-2.5 text-left transition hover:bg-sidebar-accent"
          type="button"
        >
          <UserAvatar
            name={viewer.localUser.name}
            src={viewer.localUser.avatarUrl}
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-sidebar-foreground">
              {viewer.localUser.name ?? 'Your account'}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {viewer.localUser.email}
            </p>
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56" side="top">
        <DropdownMenuItem asChild>
          <Link to="/settings">Settings</Link>
        </DropdownMenuItem>
        {viewer.localUser.role === 'super_admin' ? (
          <DropdownMenuItem asChild>
            <Link
              search={{ page: 1, role: 'all', search: '' }}
              to="/admin/users"
            >
              Manage users
            </Link>
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault()
            signOutMutation.mutate({ data: undefined })
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
    <div className="min-h-screen bg-background lg:flex">
      <div className="hidden min-h-screen shrink-0 lg:block lg:w-72">
        <Sidebar
          currentPath={location.pathname}
          footer={accountMenu}
          items={items}
        />
      </div>
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="border-b border-border/60 bg-background/85 px-4 py-4 backdrop-blur md:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="lg:hidden">
                <Sidebar
                  currentPath={location.pathname}
                  footer={accountMenu}
                  items={items}
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">Workspace</p>
                <h1 className="text-lg font-semibold">Your workspace</h1>
              </div>
            </div>
            <ThemeModeButton />
          </div>
        </header>
        <div className="flex-1 px-4 py-6 md:px-6">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

function ThemeModeButton() {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  return (
    <Button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      size="icon"
      variant="outline"
    >
      {isDark ? (
        <SunMedium className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
