import { createRouter } from '@tanstack/react-router'
import { createQueryClient } from '@/lib/query-client'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  const queryClient = createQueryClient()
  const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
    scrollRestoration: true,
    context: {
      queryClient,
    },
  })

  return router
}
