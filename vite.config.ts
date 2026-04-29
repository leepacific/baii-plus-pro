import { defineConfig } from 'vite';

export default defineConfig({
  assetsInclude: ['**/*.woff2'],
  build: {
    target: 'esnext',
    assetsInlineLimit: 4096,
    modulePreload: false,
    cssCodeSplit: false,
    rollupOptions: {
      output: { manualChunks: undefined }
    }
  }
});
