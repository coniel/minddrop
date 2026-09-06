import { defineConfig, mergeConfig } from 'vitest/config';
import { config } from '@minddrop/vitest-config/happy-dom';

export default mergeConfig(
  config,
  defineConfig({
    test: {
      setupFiles: ['./vitest.setup.ts'],
    },
  }),
);
