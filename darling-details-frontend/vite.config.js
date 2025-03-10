import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
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
    plugins: [react()],
    resolve: {
      alias: {
        '@': resolve(__dirname, './client/src'),
      },
    },
    server: {
      hmr: true,
    },
    // Drop console logs in production build
    build: {
      minify: true,
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production',
        },
      },
    },
  };
});
