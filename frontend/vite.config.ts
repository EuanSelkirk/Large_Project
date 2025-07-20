import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "http://cop4331group5.xyz:5000", // Your backend URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api"), // Rewrite if needed, or just keep as is if backend already expects /api
      },
    },
  },
});
