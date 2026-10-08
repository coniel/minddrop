import { FileSystemChangedSyncs } from '../event-handlers/file-system-changed';

/**
 * Clears the file system changed handler's sync state and cancels its
 * debounce timers.
 */
export function resetFileSystemChangedSyncs(): void {
  // Cancel the pending debounce timers
  FileSystemChangedSyncs.debounceTimers.forEach((timer) => clearTimeout(timer));

  // Clear the sync state
  FileSystemChangedSyncs.debounceTimers.clear();
  FileSystemChangedSyncs.pending.clear();
  FileSystemChangedSyncs.running.clear();
  FileSystemChangedSyncs.queued.clear();
}
