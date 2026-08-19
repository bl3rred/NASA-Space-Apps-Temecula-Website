import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // GitHub Pages serves from https://ORG.github.io/REPO/ (not "/"),
  // so use VITE_BASE during build/deploy.
  base: process.env.VITE_BASE ?? "/",
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
