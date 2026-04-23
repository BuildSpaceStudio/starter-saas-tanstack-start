import { createServerFn } from '@tanstack/react-start'

export const fetchViewer = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { getSession } = await import('@/lib/auth-helpers')
    return getSession()
  },
)
