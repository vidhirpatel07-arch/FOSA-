import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin.html'),
        notifications: resolve(__dirname, 'notifications.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        terms: resolve(__dirname, 'terms.html'),
        payment_guide: resolve(__dirname, 'payment-guide.html'),
        contact: resolve(__dirname, 'contact.html'),
        receipt: resolve(__dirname, 'receipt.html'),
        gallery: resolve(__dirname, 'gallery.html')
      }
    }
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
      '/uploads': 'http://localhost:3000'
    }
  }
});
