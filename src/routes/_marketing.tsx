import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { Moon, SunMedium } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { getBrowserClient } from '@/lib/buildspace/client'

export const Route = createFileRoute('/_marketing')({
  component: MarketingLayout,
})

function MarketingLayout() {
  function beginAuth(mode: 'sign-in' | 'sign-up') {
    const redirectUri = `${window.location.origin}/auth/callback`
    const client = getBrowserClient()

    window.location.href =
      mode === 'sign-in'
        ? client.auth.getSignInUrl({ redirectUri })
        : client.auth.getSignUpUrl({ redirectUri })
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link className="flex items-center gap-3" to="/">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              YP
            </div>
            <div>
              <p className="text-sm font-semibold">Your Product</p>
              <p className="text-xs text-muted-foreground">Starter SaaS</p>
            </div>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="/#features">Features</a>
            <Link to="/pricing">Pricing</Link>
            <a href="/#faq">FAQ</a>
            <a href="https://docs.buildspace.studio">Docs</a>
            <a href="https://github.com/buildspacestudio/starter-saas-tanstack-start">
              GitHub
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button
              className="hidden md:inline-flex"
              onClick={() => beginAuth('sign-in')}
              variant="ghost"
            >
              Sign in
            </Button>
            <Button onClick={() => beginAuth('sign-up')}>Get started</Button>
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="border-t border-border/60 bg-background/80">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
          <div className="space-y-3">
            <p className="text-sm font-semibold">Your Product</p>
            <p className="text-sm text-muted-foreground">
              Placeholder marketing copy that founders can replace before
              launch.
            </p>
          </div>
          <div className="space-y-3 text-sm">
            <p className="font-semibold">Product</p>
            <a className="block text-muted-foreground" href="/#features">
              Features
            </a>
            <Link className="block text-muted-foreground" to="/pricing">
              Pricing
            </Link>
          </div>
          <div className="space-y-3 text-sm">
            <p className="font-semibold">Resources</p>
            <a
              className="block text-muted-foreground"
              href="https://docs.buildspace.studio"
            >
              Docs
            </a>
            <a
              className="block text-muted-foreground"
              href="https://github.com/buildspacestudio/starter-saas-tanstack-start"
            >
              GitHub
            </a>
          </div>
          <div className="space-y-3 text-sm">
            <p className="font-semibold">Built on</p>
            <a
              className="block text-muted-foreground"
              href="https://buildspace.studio"
            >
              Buildspace
            </a>
            <a
              className="block text-muted-foreground"
              href="https://docs.buildspace.studio"
            >
              Buildspace docs
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function ThemeToggle() {
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
