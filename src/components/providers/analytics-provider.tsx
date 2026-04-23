import { useRouterState } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'
import { trackClient } from '@/lib/events-client'

export function AnalyticsProvider() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const previousPath = useRef<string | null>(null)

  useEffect(() => {
    if (previousPath.current === pathname) {
      return
    }

    previousPath.current = pathname

    if (pathname.startsWith('/dashboard') || pathname.startsWith('/settings')) {
      trackClient('dashboard:viewed', { path: pathname })
    }
  }, [pathname])

  return null
}
