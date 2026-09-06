import { defineConfig, mergeConfig } from 'vitest/config';
import { config as baseConfig } from './base.js';

/**
 * The vitest configuration for packages which render components,
 * running their tests in a happy-dom environment.
 *
 * @type {import("vitest/config").ViteUserConfig}
 */
export const config = mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      environment: 'happy-dom',
    },
  }),
);
