import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    // Service Worker fuer Offline-Betrieb + Installierbarkeit (PWA / MSIX).
    // Das Manifest liegt bewusst als statische Datei in public/manifest.webmanifest.
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      manifest: false,
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
      },
      devOptions: { enabled: false },
    }),
  ],
  server: {
    port: 3000,
    open: true
  },
  // Windows-Fix: esbuild legt fuer das grosse Bundle eine Temp-Datei in %TEMP% an,
  // die vom Virenscanner blockiert wird (Access is denied). Mit target "esnext" und
  // dem terser-Minifier umgehen wir esbuild fuer das Bundle -> stabiler lokaler Build.
  build: {
    target: 'esnext',
    minify: 'terser',
  }
});
