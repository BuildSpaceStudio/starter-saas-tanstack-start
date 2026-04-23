import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './drizzle',
  schema: './src/lib/db/schema.ts',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.BUILDSPACE_DB_URL || 'file:local.db',
    authToken: process.env.BUILDSPACE_DB_TOKEN,
  },
})
