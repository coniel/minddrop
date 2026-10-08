import { EntryFileChange } from '../../types';

/**
 * A change to a database's config file made outside of the app.
 */
export interface DatabaseConfigChange {
  /**
   * The ID of the database whose config changed.
   */
  databaseId: string;

  /**
   * Marks the change as a config change.
   */
  file: 'config';
}

export interface PendingSync {
  /**
   * Whether a change needs a scan of the whole workspace.
   */
  scan: boolean;

  /**
   * The changed entry files, one per entry.
   */
  changes: EntryFileChange[];

  /**
   * The IDs of the databases whose config changed, each listed once.
   */
  databaseIds: string[];
}

/**
 * The file system changed handler's sync state. Each map is keyed by
 * workspace ID.
 */
export const FileSystemChangedSyncs = {
  /**
   * The changes awaiting the end of their workspace's debounce window.
   */
  pending: new Map<string, PendingSync>(),

  /**
   * The pending debounce timers.
   */
  debounceTimers: new Map<string, ReturnType<typeof setTimeout>>(),

  /**
   * The syncs in progress. A workspace's syncs run one at a time. Two
   * syncs never interleave their SQL writes.
   */
  running: new Map<string, Promise<void>>(),

  /**
   * The changes which arrived while their workspace was syncing. They
   * run as one sync once it finishes.
   */
  queued: new Map<string, PendingSync>(),
};
