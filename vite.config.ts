import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const root = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      '@': path.join(root, 'src'),
    },
  },
  // Bundle @buildspacestudio/sdk in SSR: its emitted JS uses directory imports
  // (e.g. `from "../auth"`) that Node ESM does not resolve; Vite's resolver does.
  ssr: {
    noExternal: ['@buildspacestudio/sdk'],
  },
  server: {
    port: 3000,
  },
  plugins: [tanstackStart(), viteReact(), tailwindcss()],
})
