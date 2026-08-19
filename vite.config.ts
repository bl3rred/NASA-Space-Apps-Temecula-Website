import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Relative base (./) so the SAME build artifact works on both Vercel
  // (served from "/") and GitHub Pages (served from /REPO/). Set VITE_BASE
  // to a canonical absolute base (e.g. "/REPO/") only if you want that.
  base: process.env.VITE_BASE ?? "./",
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    open: false,
    strictPort: false,
    allowedSchemes: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  preview: {
    host: "0.0.0.0",
    port: 4173,
    allowedSchemes: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  build: {
    target: "es2020",
    sourcemap: true,
  },
});
