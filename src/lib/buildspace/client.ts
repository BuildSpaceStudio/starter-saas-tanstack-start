import { createClient } from '@buildspacestudio/sdk/client'

let browserClient: ReturnType<typeof createClient> | null = null

export function getBrowserClient() {
  const publishableKey = import.meta.env.VITE_PUBLIC_BUILDSPACE_PUBLISHABLE_KEY

  if (!publishableKey) {
    throw new Error(
      'Missing VITE_PUBLIC_BUILDSPACE_PUBLISHABLE_KEY. Copy .env.example to .env and fill in your Buildspace keys.',
    )
  }

  browserClient ??= createClient(publishableKey, {
    events: {
      flushInterval: 3000,
      maxBatchSize: 10,
    },
  })

  return browserClient
}
