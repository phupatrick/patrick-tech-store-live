import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' de build duong dan tuong doi -> chay tot tren GitHub Pages
// (https://<user>.github.io/<repo>/) cung nhu tren domain goc.
export default defineConfig({
  base: './',
  plugins: [react()],
});
