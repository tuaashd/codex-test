import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          echarts: ['echarts/core', 'echarts/charts', 'echarts/components', 'echarts/renderers', 'echarts-for-react'],
        },
      },
    },
  },
});
