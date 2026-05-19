import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@fretify/core': path.resolve(__dirname, '../../packages/core/src/index.ts'),
    },
  },
  preview: {
    // SPA fallback for direct URL access in preview mode
    open: true,
  },
});
