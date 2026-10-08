import { incrementMapCount } from '@minddrop/utils';
import { FsWatchEventKind, MockFileSystem } from '../../types';
import { registerMockAdapterOverrides } from '../registerMockAdapterOverrides';

/**
 * The counts recorded by a counting mock file system.
 */
export interface CountingMockFileSystem {
  /**
   * The number of times each path's text contents were read, keyed
   * by path.
   */
  textReads: Map<string, number>;

  /**
   * The number of times each directory was listed, keyed by path.
   */
  dirReads: Map<string, number>;

  /**
   * The number of times each path was written, keyed by path.
   */
  writes: Map<string, number>;

  /**
   * Registers the plain mock adapter again.
   */
  restore: VoidFunction;
}

/**
 * Registers the mock file system's adapter wrapped to count the text
 * reads, directory listings and writes made through it, per path. Each
 * change made through it is reported to the mock's watchers.
 *
 * @param mockFileSystem - The mock file system to wrap.
 * @returns The recorded counts and a function which registers the
 *   plain mock adapter again.
 */
export function registerCountingMockFileSystem(
  mockFileSystem: MockFileSystem,
): CountingMockFileSystem {
  // The plain mock adapter
  const adapter = mockFileSystem.MockFs;
  // The counts per path
  const textReads = new Map<string, number>();
  const dirReads = new Map<string, number>();
  const writes = new Map<string, number>();

  // Reports a change to the mock's watchers
  const echo = (kind: FsWatchEventKind, paths: string[]): void => {
    mockFileSystem.dispatchWatchEvent(kind, paths);
  };

  // Resolves the event kind an OS watcher reports for a write. A write
  // to an existing file is a 'modify', and any other an 'any'.
  const writeKind = (path: string): FsWatchEventKind =>
    mockFileSystem.exists(path) ? 'modify' : 'any';

  // Wrap the adapter. Changes which create, remove or move a path are
  // reported as 'any' events.
  const restore = registerMockAdapterOverrides(mockFileSystem, {
    // Count text reads
    readTextFile: async (path, options) => {
      incrementMapCount(textReads, path);

      return adapter.readTextFile(path, options);
    },
    // Count batched text reads
    readTextFiles: async (paths, options) => {
      paths.forEach((path) => incrementMapCount(textReads, path));

      return adapter.readTextFiles(paths, options);
    },
    // Count directory listings
    readDir: async (path, options) => {
      incrementMapCount(dirReads, path);

      return adapter.readDir(path, options);
    },
    // Count and report text writes
    writeTextFile: async (path, contents, options) => {
      // Resolve the event kind before the write creates the file
      const kind = writeKind(path);

      incrementMapCount(writes, path);
      await adapter.writeTextFile(path, contents, options);
      echo(kind, [path]);
    },
    // Count and report batched text writes
    writeTextFiles: async (entries, options) => {
      // Resolve the event kinds before the writes create the files
      const kinds = entries.map((entry) => writeKind(entry.path));

      entries.forEach((entry) => incrementMapCount(writes, entry.path));
      await adapter.writeTextFiles(entries, options);
      entries.forEach((entry, index) => echo(kinds[index], [entry.path]));
    },
    // Count and report binary writes
    writeBinaryFile: async (path, file, options) => {
      // Resolve the event kind before the write creates the file
      const kind = writeKind(path);

      incrementMapCount(writes, path);
      await adapter.writeBinaryFile(path, file, options);
      echo(kind, [path]);
    },
    // Count and report copies as writes to the destination
    copyFile: async (source, destination, options) => {
      incrementMapCount(writes, destination);
      await adapter.copyFile(source, destination, options);
      echo('any', [destination]);
    },
    // Report directory creations
    createDir: async (path, options) => {
      await adapter.createDir(path, options);
      echo('any', [path]);
    },
    // Report renames
    rename: async (oldPath, newPath, options) => {
      await adapter.rename(oldPath, newPath, options);
      echo('any', [oldPath, newPath]);
    },
    // Report file removals
    removeFile: async (path, options) => {
      await adapter.removeFile(path, options);
      echo('any', [path]);
    },
    // Report directory removals
    removeDir: async (path, options) => {
      await adapter.removeDir(path, options);
      echo('any', [path]);
    },
    // Report trashed files
    trashFile: async (path) => {
      await adapter.trashFile(path);
      echo('any', [path]);
    },
    // Report trashed directories
    trashDir: async (path) => {
      await adapter.trashDir(path);
      echo('any', [path]);
    },
  });

  return { textReads, dirReads, writes, restore };
}
