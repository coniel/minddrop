import { createObjectStore } from '@minddrop/stores';

export type ConfigPanelTab =
  | 'queries'
  | 'collections'
  | 'properties'
  | 'designs';

export interface DatabaseViewState {
  /**
   * The database ID this state belongs to.
   */
  databaseId: string;

  /**
   * The ID of the last active view tab.
   */
  activeViewId: string | null;

  /**
   * Whether the configuration panel is open.
   */
  configPanelOpen: boolean;

  /**
   * The active tab in the configuration panel.
   */
  configPanelTab: ConfigPanelTab;
}

/**
 * Persisted object store that tracks per-database view state
 * such as the active view, configuration panel visibility,
 * and active configuration panel tab.
 */
export const DatabaseViewStateStore = createObjectStore<DatabaseViewState>(
  'Databases:ViewState',
  'databaseId',
  {
    persistTo: 'app-config',
    namespace: 'database-view-state',
  },
);

const defaultState: Omit<DatabaseViewState, 'databaseId'> = {
  activeViewId: null,
  configPanelOpen: false,
  configPanelTab: 'properties',
};

/**
 * Returns the persisted view state for a database,
 * falling back to defaults for missing fields.
 */
export function useDatabaseViewState(databaseId: string): DatabaseViewState {
  const stored = DatabaseViewStateStore.useItem(databaseId);

  return {
    ...defaultState,
    databaseId,
    ...stored,
  };
}

/**
 * Updates a subset of the view state for a database,
 * creating the entry if it does not exist.
 */
export function setDatabaseViewState(
  databaseId: string,
  updates: Partial<Omit<DatabaseViewState, 'databaseId'>>,
): void {
  const existing = DatabaseViewStateStore.get(databaseId);

  if (existing) {
    DatabaseViewStateStore.update(databaseId, updates);
  } else {
    DatabaseViewStateStore.set({
      ...defaultState,
      databaseId,
      ...updates,
    });
  }
}
