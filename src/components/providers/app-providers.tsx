import type { QueryClient } from '@tanstack/react-query'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type * as React from 'react'
import { AnalyticsProvider } from '@/components/providers/analytics-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Toaster } from '@/components/ui/sonner'

export function AppProviders({
  children,
  queryClient,
}: {
  children: React.ReactNode
  queryClient: QueryClient
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        {children}
        <AnalyticsProvider />
        <Toaster richColors closeButton />
        <ReactQueryDevtools buttonPosition="bottom-left" />
      </QueryClientProvider>
    </ThemeProvider>
  )
}
