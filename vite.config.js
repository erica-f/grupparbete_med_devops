import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        exercises: resolve(__dirname, 'exercises.html'),
        achievements: resolve(__dirname, 'achievements.html'),
        training: resolve(__dirname, 'training.html'),
      },
    },
  },
});