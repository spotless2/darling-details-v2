import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(async ({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  
  // Only log in development mode
  if (mode === 'development') {
    console.log('Build mode:', mode);
    console.log('Environment variables loaded by Vite:', {
      VITE_API_URL: env.VITE_API_URL,
      VITE_APP_NAME: env.VITE_APP_NAME,
    });
  }

  return {
    plugins: [
      react(),
      themePlugin(),
      runtimeErrorOverlay(),
      ...(process.env.NODE_ENV !== "production" &&
      process.env.REPL_ID !== undefined
        ? [
            await import("@replit/vite-plugin-cartographer").then((m) =>
              m.cartographer(),
            ),
          ]
        : []),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client", "src"),
        "@shared": path.resolve(__dirname, "shared"),
      },
    },
    root: path.resolve(__dirname, "client"),
    build: {
      outDir: path.resolve(__dirname, "dist/public"),
      emptyOutDir: true,
    },
    server: {
      // Add proxy configuration for your actual backend
      proxy: {
        "/api": {
          target: "http://localhost:3000", // Your actual backend URL
          changeOrigin: true,
        },
      },
    },
  };
});