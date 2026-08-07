/// <reference types="vite/client" />

/**
 * stories.ts
 * Loads this package's story files, each of which registers its
 * own stories. Importing this module is all it takes for them to
 * be listed in the dev tools.
 */
import.meta.glob('./**/*.stories.tsx', { eager: true });
