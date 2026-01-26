import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// 1. Import the necessary dependencies using ES module syntax
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 2. Reference the imported variables in the postcss configuration array
  css: {
    postcss: {
      plugins: [
        tailwindcss, // Use the imported tailwindcss function
        autoprefixer, // Use the imported autoprefixer function
      ],
    },
  },
});