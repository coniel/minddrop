/**
 * The persistence target for a store.
 *
 * - `app-config`: Persisted globally for the app (e.g. theme, sidebar width).
 * - `workspace-config`: Persisted per workspace (e.g. view settings).
 */
export type PersistTarget = 'app-config' | 'workspace-config';

/**
 * Configuration options for store persistence.
 */
export interface PersistOptions {
  /**
   * Where to persist the store data.
   */
  persistTo: PersistTarget;

  /**
   * A namespace for the persisted data, typically
   * the consuming package name.
   */
  namespace: string;
}
