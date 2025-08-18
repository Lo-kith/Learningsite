import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss(),
    
  ],
  
  server: {
    proxy: {
      '/send-email': 'http://localhost:5000', // Proxy all /send-email calls to backend
    },
  },
});
