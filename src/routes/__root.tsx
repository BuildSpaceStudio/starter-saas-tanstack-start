import type { QueryClient } from '@tanstack/react-query'
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from '@tanstack/react-router'
import type * as React from 'react'
import { AppProviders } from '@/components/providers/app-providers'
import '@/styles.css'

interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Your Product',
      },
      {
        name: 'description',
        content:
          'Your Product — a modern SaaS template with marketing pages, customer dashboard, and admin tools.',
      },
    ],
  }),
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md space-y-4 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
          Not Found
        </p>
        <h1 className="font-serif text-4xl">This route does not exist.</h1>
        <p className="text-muted-foreground">
          Check the URL or head back to the marketing page to keep exploring.
        </p>
      </div>
    </div>
  ),
  component: RootComponent,
})

function RootComponent() {
  const { queryClient } = Route.useRouteContext()

  return (
    <RootDocument>
      <AppProviders queryClient={queryClient}>
        <Outlet />
      </AppProviders>
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
