import { vi } from 'vitest';
import { Fs } from '@minddrop/file-system';
import { FileSystemChangeSyncDebounceMs } from '../constants';

/**
 * Advances the fake timers past the file system watcher's and the file
 * system changed handler's debounce windows. A change reported by the
 * watcher then reaches the backend.
 *
 * @returns A promise resolving once both debounce windows have passed.
 */
export async function flushFileSystemChangeDebounces(): Promise<void> {
  // Let in-flight file operations finish
  await Fs.tests.awaitAllOperations();

  // Advance past the watcher's debounce window
  await vi.advanceTimersByTimeAsync(Fs.constants.WatcherDebounceMs);

  // Advance past the handler's debounce window
  await vi.advanceTimersByTimeAsync(FileSystemChangeSyncDebounceMs);
}
