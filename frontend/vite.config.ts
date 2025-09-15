// frontend/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Antes: base: './',
  base: '/',            // ← assets con ruta absoluta
  plugins: [react()],
});
