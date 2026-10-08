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
      environmentOptions: {
        happyDOM: {
          settings: {
            // Never load an iframe's page, so a test rendering one
            // makes no network request.
            disableIframePageLoading: true,
          },
        },
      },
    },
  }),
);
