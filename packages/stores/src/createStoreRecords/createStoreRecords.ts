import { StoreScope } from '../types';
import {
  getActiveWorkspaceScope,
  subscribeToActiveWorkspaceScope,
} from '../workspaceScope';

// The key under which an unscoped store keeps its only record, and a
// scoped store keeps the record it reads while no workspace is active.
const DefaultRecordKey = '';

export interface StoreRecords<TRecord> {
  /**
   * Resolves the workspace a call addresses: the given one, else the
   * active one, else none when the store is not scoped by workspace
   * or no workspace is active.
   *
   * @param workspaceId - The workspace the call was made for, if any.
   */
  resolveWorkspaceId(workspaceId?: string): string | undefined;

  /**
   * Returns a workspace's record, or an empty one when the workspace
   * has none yet.
   *
   * @param workspaceId - The workspace whose record to get. Omit for the active workspace.
   */
  get(workspaceId?: string): TRecord;

  /**
   * Replaces a workspace's record, mirroring it into the store state
   * when the workspace is the active one.
   *
   * @param record - The new record.
   * @param workspaceId - The workspace whose record to replace. Omit for the active workspace.
   */
  set(record: TRecord, workspaceId?: string): void;

  /**
   * Drops a workspace's record.
   *
   * @param workspaceId - The workspace whose record to drop.
   */
  drop(workspaceId: string): void;
}

/**
 * Creates the records backing a store, one per workspace when the
 * store is scoped by workspace and a single one otherwise.
 *
 * The store state only ever holds the active workspace's record, so
 * the hooks and selectors reading it are unaware of the scoping. The
 * records mirror into it whenever the active record changes, whether
 * by a write or by another workspace becoming active.
 *
 * @param scope - What the store's records are scoped by.
 * @param createEmpty - Creates the record of a workspace which has none yet.
 * @param mirror - Replaces the record held in the store state.
 * @returns The store's records.
 */
export function createStoreRecords<TRecord>(
  scope: StoreScope | undefined,
  createEmpty: () => TRecord,
  mirror: (record: TRecord) => void,
): StoreRecords<TRecord> {
  const records = new Map<string, TRecord>();

  function resolveWorkspaceId(workspaceId?: string): string | undefined {
    if (scope !== 'workspace') {
      return undefined;
    }

    return workspaceId ?? getActiveWorkspaceScope() ?? undefined;
  }

  function resolveKey(workspaceId?: string): string {
    return resolveWorkspaceId(workspaceId) ?? DefaultRecordKey;
  }

  function get(workspaceId?: string): TRecord {
    return records.get(resolveKey(workspaceId)) ?? createEmpty();
  }

  function set(record: TRecord, workspaceId?: string): void {
    const key = resolveKey(workspaceId);

    records.set(key, record);

    if (key === resolveKey()) {
      mirror(record);
    }
  }

  function drop(workspaceId: string): void {
    records.delete(workspaceId);

    if (workspaceId === resolveKey()) {
      mirror(createEmpty());
    }
  }

  // Swap the mirrored record when another workspace becomes active
  if (scope === 'workspace') {
    subscribeToActiveWorkspaceScope(() => mirror(get()));
  }

  return { resolveWorkspaceId, get, set, drop };
}
