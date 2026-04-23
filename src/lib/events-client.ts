import { getBrowserClient } from '@/lib/buildspace/client'

type EventProperties = Record<
  string,
  string | number | boolean | null | undefined
>

export function trackClient(event: string, properties: EventProperties = {}) {
  try {
    getBrowserClient().events.track(event, properties)
  } catch (error) {
    console.warn(`[events-client] Failed to queue ${event}`, error)
  }
}
