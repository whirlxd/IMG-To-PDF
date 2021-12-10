import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      includeAssets: [
        "favicon.svg",
        "favicon.ico",
        "robots.txt",
        "apple-touch-icon.png",
      ],
      registerType: "autoUpdate",
      manifest: {
        name: "IMG To PDF",
        short_name: "iTp",
        icons: [
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
        theme_color: "#2a2e38",
        background_color: "#2a2e38",
        display: "standalone",
        start_url: "/app",
        lang: "en-US",
        orientation: "portrait-primary",
      },
    }),
  ],
});
