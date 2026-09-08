/**
 * The persistence target for a store.
 *
 * - `app-config`: The app on this device, whatever workspace is open
 *   (e.g. theme, sidebar width).
 * - `workspace-config`: The workspace, on every device it syncs to
 *   (e.g. defaults applied to new databases).
 * - `app-workspace-config`: The workspace on this device only
 *   (e.g. open tabs, panel sizes).
 */
export type PersistTarget =
  | 'app-config'
  | 'workspace-config'
  | 'app-workspace-config';

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
