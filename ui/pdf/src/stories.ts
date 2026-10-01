/// <reference types="vite/client" />

/**
 * stories.ts
 * Loads this package's story files. Each registers its own stories.
 * Importing this module lists them in the dev tools.
 */
import.meta.glob('./**/*.stories.tsx', { eager: true });
