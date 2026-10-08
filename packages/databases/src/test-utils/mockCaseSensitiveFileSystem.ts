import type * as FileSystemTestUtils from '@minddrop/file-system/test-utils';

/**
 * Creates the `@minddrop/file-system/test-utils` module with every
 * mock file system made case-sensitive, as on Linux. Other options
 * passed to `initializeMockFileSystem` are kept.
 *
 * Must be imported by its own path inside a `vi.mock` factory, never
 * through the test-utils barrel.
 *
 * @param importOriginal - The `vi.mock` factory's original module importer.
 * @returns The mocked module.
 */
export async function mockCaseSensitiveFileSystem(
  importOriginal: <TModule>() => Promise<TModule>,
): Promise<typeof FileSystemTestUtils> {
  // Import the original module
  const original = await importOriginal<typeof FileSystemTestUtils>();

  // Replace the mock file system initializer
  return {
    // The original module
    ...original,
    // Make the mock file system case-sensitive
    initializeMockFileSystem: (files, options) =>
      original.initializeMockFileSystem(files, {
        ...options,
        caseSensitive: true,
      }),
  };
}
