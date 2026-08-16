import { hashContents } from '../utils/hashContents';

// The maximum number of paths tracked at once. Entries are
// evicted in insertion order once the cap is reached.
const MaxEntries = 1000;

// Content hashes of files written by the app, keyed by path
const writtenContentHashes = new Map<string, string>();

/**
 * Records the hash of contents the app is writing to a path, so
 * that a file system change event for that path can be recognised
 * as the app's own write rather than an external one.
 *
 * @param path - The path being written to.
 * @param contents - The contents being written.
 */
export function recordWrittenContents(path: string, contents: string): void {
  // Re-inserting moves the path to the end of the eviction order
  writtenContentHashes.delete(path);
  writtenContentHashes.set(path, hashContents(contents));

  // Evict the oldest entry once over the cap
  if (writtenContentHashes.size > MaxEntries) {
    const oldest = writtenContentHashes.keys().next();

    if (!oldest.done) {
      writtenContentHashes.delete(oldest.value);
    }
  }
}

/**
 * Checks whether the app has written to the given path.
 *
 * @param path - The path to check.
 * @returns Whether contents have been recorded for the path.
 */
export function hasWrittenContents(path: string): boolean {
  return writtenContentHashes.has(path);
}

/**
 * Checks whether the given contents are the ones the app last
 * wrote to the path.
 *
 * @param path - The path to check.
 * @param contents - The contents to compare against the recorded hash.
 * @returns Whether the contents match the app's last write.
 */
export function matchesWrittenContents(
  path: string,
  contents: string,
): boolean {
  const recorded = writtenContentHashes.get(path);

  if (!recorded) {
    return false;
  }

  return recorded === hashContents(contents);
}

/**
 * Clears all recorded write hashes.
 */
export function clearWriteRegistry(): void {
  writtenContentHashes.clear();
}
