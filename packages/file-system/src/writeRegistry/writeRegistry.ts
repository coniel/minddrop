import { FsFileStats } from '../types';
import { hashContents } from '../utils/hashContents';

// The maximum number of paths tracked at once. Entries are
// evicted in insertion order once the cap is reached.
const MaxEntries = 1000;

// How a write was recorded. Text writes are recorded by the hash of
// their contents. Other writes are recorded by the file's resulting
// size and modification time, as their contents are costly to read
// back or never pass through the app.
type RecordedWrite =
  | { kind: 'contents'; hash: string }
  | { kind: 'stats'; size: number; lastModified: number };

// How a write was recorded, by contents or by stats
export type RecordedWriteKind = RecordedWrite['kind'];

// Writes recorded by the app, keyed by path
const recordedWrites = new Map<string, RecordedWrite>();

/**
 * Records the hash of contents the app is writing to a path. A change
 * event for the path can then be recognised as the app's own write.
 *
 * @param path - The path being written to.
 * @param contents - The contents being written.
 */
export function recordWrittenContents(path: string, contents: string): void {
  // Record the contents' hash
  recordWrite(path, { kind: 'contents', hash: hashContents(contents) });
}

/**
 * Records the size and modification time of a file the app wrote. A
 * change event for the path can then be recognised as the app's own
 * write.
 *
 * @param path - The path written to.
 * @param stats - The file's stats after the write.
 */
export function recordWrittenStats(
  path: string,
  stats: Pick<FsFileStats, 'size' | 'lastModified'>,
): void {
  // Record the file's size and modification time
  recordWrite(path, {
    kind: 'stats',
    size: stats.size,
    lastModified: stats.lastModified.getTime(),
  });
}

/**
 * Returns how the app's last write to a path was recorded.
 *
 * @param path - The path to check.
 * @returns The kind of the recorded write, or null if the app has not written to the path.
 */
export function findRecordedWriteKind(path: string): RecordedWriteKind | null {
  return recordedWrites.get(path)?.kind ?? null;
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
  // Get the app's last write to the path
  const recorded = recordedWrites.get(path);

  // Check the write was recorded by its contents
  if (recorded?.kind !== 'contents') {
    return false;
  }

  // Compare the contents' hash to the recorded one
  return recorded.hash === hashContents(contents);
}

/**
 * Checks whether a file's stats match the app's last write to it.
 *
 * @param path - The path to check.
 * @param stats - The file's current stats.
 * @returns Whether the stats match the app's last write.
 */
export function matchesWrittenStats(
  path: string,
  stats: Pick<FsFileStats, 'size' | 'lastModified'>,
): boolean {
  // Get the app's last write to the path
  const recorded = recordedWrites.get(path);

  // Check the write was recorded by its stats
  if (recorded?.kind !== 'stats') {
    return false;
  }

  // Compare the file's stats to the recorded ones
  return (
    recorded.size === stats.size &&
    recorded.lastModified === stats.lastModified.getTime()
  );
}

/**
 * Clears all recorded write hashes.
 */
export function clearWriteRegistry(): void {
  recordedWrites.clear();
}

/**
 * Records a write, evicting the oldest recorded write once over
 * the cap.
 *
 * @param path - The path written to.
 * @param write - The recorded write.
 */
function recordWrite(path: string, write: RecordedWrite): void {
  // Re-insert the path, moving it to the end of the eviction order
  recordedWrites.delete(path);
  recordedWrites.set(path, write);

  // Evict the oldest entry once over the cap
  if (recordedWrites.size > MaxEntries) {
    const oldest = recordedWrites.keys().next();

    if (!oldest.done) {
      recordedWrites.delete(oldest.value);
    }
  }
}
