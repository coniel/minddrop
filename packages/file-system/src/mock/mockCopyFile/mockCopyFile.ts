import { FsEntry, MockFileSystemOptions } from '../../types';
import { mockAddFileEntry } from '../mockAddFileEntry';
import { mockGetFileEntry } from '../mockGetFileEntry';
import { resolveRelocatedMockFileEntry } from '../resolveRelocatedMockFileEntry';

/**
 * Creates a copy of a mock file entry.
 *
 * @param root - The file system root file entry.
 * @param path - The path of the file entry to copy.
 * @param copyPath - The path to where to copy the file entry.
 * @param options - The mock file system's matching options.
 *
 * @throws {Error} If the path does not exist.
 * @throws {Error} If the copy path already exists.
 */
export function mockCopyFile(
  root: FsEntry,
  path: string,
  copyPath: string,
  options: MockFileSystemOptions,
): void {
  // Get the entry to copy
  const fileEntry = mockGetFileEntry(root, path, options);

  // Add a copy of the entry at the copy path
  mockAddFileEntry(
    root,
    resolveRelocatedMockFileEntry(fileEntry, copyPath),
    options,
  );
}
