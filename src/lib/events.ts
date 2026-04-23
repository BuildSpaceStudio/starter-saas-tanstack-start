import { getServerClient } from '@/lib/buildspace/server'

type EventProperties = Record<
  string,
  string | number | boolean | null | undefined
>

export async function trackServer(
  event: string,
  properties: EventProperties = {},
  actorId?: string,
) {
  try {
    await getServerClient().events.track(event, properties, actorId)
  } catch (error) {
    console.warn(`[events] Failed to track ${event}`, error)
  }
}

export async function trackServerWithSession(
  token: string,
  event: string,
  properties: EventProperties = {},
  actorId?: string,
) {
  const client = getServerClient()

  try {
    client.setSession(token)
    await client.events.track(event, properties, actorId)
  } catch (error) {
    console.warn(`[events] Failed to track ${event}`, error)
  } finally {
    client.clearSession()
  }
}
