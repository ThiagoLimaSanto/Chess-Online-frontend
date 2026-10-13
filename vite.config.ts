import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      open: true,
      allowedHosts: [
        'discusses-cooked-updating-participated.trycloudflare.com',
      ],
      proxy: {
        '/api': {
          target: env.VITE_API_TARGET ?? 'https://resume-shall-rochester-yours.trycloudflare.com',
          changeOrigin: true,
        },
        '/ws': {
          target: env.VITE_API_TARGET ?? 'https://resume-shall-rochester-yours.trycloudflare.com',
          changeOrigin: true,
          ws: true,
        },
      },
    },
  }
})
