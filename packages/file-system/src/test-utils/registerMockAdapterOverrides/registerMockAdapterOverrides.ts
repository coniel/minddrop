import { registerFileSystemAdapter } from '../../FileSystem';
import { FileSystemAdapter, MockFileSystem } from '../../types';

/**
 * Registers the mock file system's adapter with some of its methods
 * replaced. The mock's reset is kept for the test cleanup.
 *
 * @param mockFileSystem - The mock file system whose adapter to override.
 * @param overrides - The adapter methods to replace.
 * @returns A function which registers the plain mock adapter again.
 */
export function registerMockAdapterOverrides(
  mockFileSystem: MockFileSystem,
  overrides: Partial<FileSystemAdapter>,
): VoidFunction {
  // Register the adapter with the overrides
  registerMockAdapter(mockFileSystem, {
    ...mockFileSystem.MockFs,
    ...overrides,
  });

  // Return a function which registers the plain adapter again
  return () => registerMockAdapter(mockFileSystem, mockFileSystem.MockFs);
}

/**
 * Registers an adapter the way the mock file system registers its own.
 *
 * @param mockFileSystem - The mock file system whose reset to keep.
 * @param adapter - The adapter to register.
 */
function registerMockAdapter(
  mockFileSystem: MockFileSystem,
  adapter: FileSystemAdapter,
): void {
  registerFileSystemAdapter(adapter, {
    skipQueue: true,
    reset: mockFileSystem.reset,
  });
}
