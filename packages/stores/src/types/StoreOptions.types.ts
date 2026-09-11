import { PersistOptions } from './PersistOptions.types';

/**
 * What a store's records are scoped by.
 *
 * - `workspace`: the store keeps one record per workspace and reads
 *   and writes the active workspace's record unless told otherwise.
 */
export type StoreScope = 'workspace';

/**
 * Configuration options for a store.
 */
export interface StoreOptions {
  /**
   * Where and under what name the store data is persisted. Omit for
   * a store that lives in memory only.
   */
  persist?: PersistOptions;

  /**
   * What the store's records are scoped by. Omit for a store that
   * holds a single record.
   */
  scope?: StoreScope;
}

/**
 * Configuration options for a store scoped by workspace.
 */
export interface WorkspaceScopedStoreOptions extends StoreOptions {
  scope: 'workspace';
}
