// import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  // plugins: [react()],
  test: {
    environment: 'happy-dom',
    // The package currently has no tests of its own
    passWithNoTests: true,
  },
});
