import { createKeyValueStore } from '@minddrop/stores';

export interface DatabasesFeatureStateValues {
  /**
   * The ID of the database currently open in the main
   * content area, or `null` if none is open.
   */
  activeDatabaseId: string | null;
}

export const DatabasesFeatureState =
  createKeyValueStore<DatabasesFeatureStateValues>('Databases:FeatureState', {
    activeDatabaseId: null,
  });

/**
 * Returns the ID of the database currently open in the
 * main content area, or `null` if none is open.
 */
export const useActiveDatabaseId = (): string | null => {
  return DatabasesFeatureState.useValue('activeDatabaseId');
};
