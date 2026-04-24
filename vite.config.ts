import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/** GitHub Pages project site: VITE_BASE=/repo-name/ ; свой домен или VPS — не задавать (/) */
function baseUrl() {
  const raw = process.env.VITE_BASE;
  if (!raw || raw === "/") return "/";
  return raw.endsWith("/") ? raw : `${raw}/`;
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: baseUrl(),
  server: {
    host: true,
    port: 5173,
  },
  preview: {
    host: true,
    port: 4173,
  },
});
