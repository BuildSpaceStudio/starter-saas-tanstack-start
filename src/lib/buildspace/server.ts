import Buildspace from '@buildspacestudio/sdk'

let serverClient: Buildspace | null = null

export function getServerClient() {
  const secretKey = process.env.BUILDSPACE_SECRET_KEY

  if (!secretKey) {
    throw new Error(
      'Missing BUILDSPACE_SECRET_KEY. Copy .env.example to .env and fill in your Buildspace keys.',
    )
  }

  serverClient ??= new Buildspace(secretKey)
  return serverClient
}
