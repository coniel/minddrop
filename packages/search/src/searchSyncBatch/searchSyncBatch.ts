import { getSearchAdapter } from '../SearchAdapter';

/**
 * Delay between the first buffered change and the flush.
 * Kept short so single edits still feel instant, while
 * mass operations collapse into a single sync call.
 */
const FLUSH_DELAY_MS = 150;

/**
 * An entry as indexed by the full-text search index.
 */
interface SearchSyncEntry {
  id: string;
  title: string;
  databaseId: string;
}

/**
 * The changes buffered for a single workspace.
 */
interface WorkspaceBatch {
  /**
   * Entries to upsert, keyed by entry ID so the latest
   * state wins.
   */
  entryUpserts: Map<string, SearchSyncEntry>;

  /**
   * IDs of the entries to remove from the index.
   */
  entryDeletes: Set<string>;

  /**
   * IDs of the databases to re-index in full.
   */
  databaseReindexes: Set<string>;
}

const batches = new Map<string, WorkspaceBatch>();

let flushTimeout: ReturnType<typeof setTimeout> | null = null;

/**
 * Buffers entry upserts for the next search sync flush.
 */
export function queueEntryUpserts(
  workspaceId: string,
  entries: SearchSyncEntry[],
): void {
  const batch = getBatch(workspaceId);

  for (const entry of entries) {
    // Drop any buffered delete of the entry, it has since
    // been re-created
    batch.entryDeletes.delete(entry.id);

    // Buffer the entry, replacing any earlier state
    batch.entryUpserts.set(entry.id, {
      id: entry.id,
      title: entry.title,
      databaseId: entry.databaseId,
    });
  }

  scheduleFlush();
}

/**
 * Buffers entry deletions for the next search sync flush.
 */
export function queueEntryDeletes(
  workspaceId: string,
  entryIds: string[],
): void {
  const batch = getBatch(workspaceId);

  for (const entryId of entryIds) {
    // Drop any buffered upsert of the entry, it has since
    // been deleted
    batch.entryUpserts.delete(entryId);

    // Buffer the deletion
    batch.entryDeletes.add(entryId);
  }

  scheduleFlush();
}

/**
 * Buffers a full re-index of a database for the next search
 * sync flush. Repeated requests for the same database
 * result in a single re-index.
 */
export function queueDatabaseReindex(
  workspaceId: string,
  databaseId: string,
): void {
  getBatch(workspaceId).databaseReindexes.add(databaseId);

  scheduleFlush();
}

/**
 * Immediately sends all buffered changes to the search
 * adapter, cancelling the pending flush.
 */
export function flushSearchSyncBatch(): void {
  // Cancel the pending flush, if any
  if (flushTimeout) {
    clearTimeout(flushTimeout);
    flushTimeout = null;
  }

  // Take the buffered batches, allowing changes dispatched
  // while flushing to accumulate into fresh ones
  const pending = new Map(batches);

  batches.clear();

  for (const [workspaceId, batch] of pending) {
    // Remove deleted entries from the index
    if (batch.entryDeletes.size > 0) {
      getSearchAdapter().searchSync({
        workspaceId,
        action: 'delete',
        entryIds: [...batch.entryDeletes],
      });
    }

    // Add/update the changed entries
    if (batch.entryUpserts.size > 0) {
      getSearchAdapter().searchSync({
        workspaceId,
        action: 'upsert',
        entries: [...batch.entryUpserts.values()],
      });
    }

    // Re-index the databases with schema changes
    for (const databaseId of batch.databaseReindexes) {
      getSearchAdapter().searchReindexDatabase({
        workspaceId,
        databaseId,
      });
    }
  }
}

/**
 * Discards all buffered changes and the pending flush.
 */
export function clearSearchSyncBatch(): void {
  if (flushTimeout) {
    clearTimeout(flushTimeout);
    flushTimeout = null;
  }

  batches.clear();
}

/**
 * Returns the workspace's buffered batch, creating it if
 * this is its first buffered change.
 */
function getBatch(workspaceId: string): WorkspaceBatch {
  const existing = batches.get(workspaceId);

  if (existing) {
    return existing;
  }

  const batch: WorkspaceBatch = {
    entryUpserts: new Map(),
    entryDeletes: new Set(),
    databaseReindexes: new Set(),
  };

  batches.set(workspaceId, batch);

  return batch;
}

/**
 * Schedules a flush, pushing back any flush already
 * scheduled so that a stream of changes results in a single
 * sync call once it settles.
 */
function scheduleFlush(): void {
  if (flushTimeout) {
    clearTimeout(flushTimeout);
  }

  flushTimeout = setTimeout(flushSearchSyncBatch, FLUSH_DELAY_MS);
}
