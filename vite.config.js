import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  // IMPORTANTE: Esto debe coincidir con el nombre de tu repo
  base: '/Microlab-Viajes/', 
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Microlab Viajes',
        short_name: 'Microlab',
        description: 'Gestión de viajes y logística',
        theme_color: '#ffffff',
        start_url: '/Microlab-Viajes/', // Importante para GitHub Pages
        scope: '/Microlab-Viajes/',     // Importante para GitHub Pages
        display: "standalone",
        background_color: "#ffffff",
        icons: [
          {
            src: 'pwa-192x192.png', // VitePWA generará estos o debes ponerlos en /public
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
