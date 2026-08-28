import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    // The package currently has no tests of its own
    passWithNoTests: true,
  },
});
