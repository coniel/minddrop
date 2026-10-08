import { FsFileStats } from '../types';
import { hashContents } from '../utils/hashContents';

// The maximum number of paths tracked at once. Entries are
// evicted in insertion order once the cap is reached.
const MaxEntries = 1000;

// How a write was recorded: by the hash of its contents for text,
// or by the file's resulting size and modification time for files
// whose contents are costly to read back or never pass through the
// app (binary writes, copies and downloads).
type RecordedWrite =
  | { kind: 'contents'; hash: string }
  | { kind: 'stats'; size: number; lastModified: number };

// Writes recorded by the app, keyed by path
const recordedWrites = new Map<string, RecordedWrite>();

/**
 * Records the hash of contents the app is writing to a path, so
 * that a file system change event for that path can be recognised
 * as the app's own write rather than an external one.
 *
 * @param path - The path being written to.
 * @param contents - The contents being written.
 */
export function recordWrittenContents(path: string, contents: string): void {
  recordWrite(path, { kind: 'contents', hash: hashContents(contents) });
}

/**
 * Records the size and modification time a file was left with by
 * the app, so that a file system change event for that path can be
 * recognised as the app's own write rather than an external one.
 *
 * @param path - The path written to.
 * @param stats - The file's stats after the write.
 */
export function recordWrittenStats(
  path: string,
  stats: Pick<FsFileStats, 'size' | 'lastModified'>,
): void {
  recordWrite(path, {
    kind: 'stats',
    size: stats.size,
    lastModified: stats.lastModified.getTime(),
  });
}

/**
 * Returns how the app's last write to a path was recorded, which
 * is what a change to the path must be compared against.
 *
 * @param path - The path to check.
 * @returns The kind of the recorded write, or null if the app has not written to the path.
 */
export function getRecordedWriteKind(
  path: string,
): RecordedWrite['kind'] | null {
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
  const recorded = recordedWrites.get(path);

  if (recorded?.kind !== 'contents') {
    return false;
  }

  return recorded.hash === hashContents(contents);
}

/**
 * Checks whether the given stats are the ones the app left the
 * file at the path with.
 *
 * @param path - The path to check.
 * @param stats - The file's current stats.
 * @returns Whether the stats match the app's last write.
 */
export function matchesWrittenStats(
  path: string,
  stats: Pick<FsFileStats, 'size' | 'lastModified'>,
): boolean {
  const recorded = recordedWrites.get(path);

  if (recorded?.kind !== 'stats') {
    return false;
  }

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
 */
function recordWrite(path: string, write: RecordedWrite): void {
  // Re-inserting moves the path to the end of the eviction order
  recordedWrites.delete(path);
  recordedWrites.set(path, write);

  if (recordedWrites.size > MaxEntries) {
    const oldest = recordedWrites.keys().next();

    if (!oldest.done) {
      recordedWrites.delete(oldest.value);
    }
  }
}
