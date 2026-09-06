import { defineConfig } from 'vitest/config';

/**
 * The shared vitest configuration for the repository.
 *
 * Caps the workers each package run forks so that a full turbo run,
 * which runs several packages at once, does not swamp the machine.
 * Pass `--maxWorkers` on the command line to lift the cap for a
 * single large suite.
 *
 * @type {import("vitest/config").ViteUserConfig}
 */
export const config = defineConfig({
  test: {
    maxWorkers: '30%',
  },
});
