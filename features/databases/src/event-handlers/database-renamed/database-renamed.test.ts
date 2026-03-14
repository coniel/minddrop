import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseFixtures } from '@minddrop/databases';
import { DatabaseViewStateStore } from '../../DatabaseViewStateStore';
import { cleanup, setup } from '../../test-utils';
import { onRenameDatabase } from './database-renamed';

const { objectDatabase } = DatabaseFixtures;

// Simulated renamed database with a new ID and path
const renamedDatabase = {
  ...objectDatabase,
  id: 'Renamed Objects',
  name: 'Renamed Objects',
  path: objectDatabase.path.replace('Objects', 'Renamed Objects'),
};

const viewState = {
  databaseId: objectDatabase.id,
  activeViewId: 'view-1',
  configPanelOpen: true,
  configPanelTab: 'designs' as const,
};

describe('onRenameDatabase', () => {
  beforeEach(() => {
    setup();

    // Seed the store with view state for the original database
    DatabaseViewStateStore.set(viewState);
  });

  afterEach(() => {
    DatabaseViewStateStore.clear();
    cleanup();
  });

  it('migrates view state from the old ID to the new ID', () => {
    onRenameDatabase({
      original: objectDatabase,
      updated: renamedDatabase,
    });

    // Old entry should be removed
    expect(DatabaseViewStateStore.get(objectDatabase.id)).toBeNull();

    // New entry should have the same state with the updated ID
    const migrated = DatabaseViewStateStore.get(renamedDatabase.id);

    expect(migrated).toEqual({
      ...viewState,
      databaseId: renamedDatabase.id,
    });
  });

  it('does nothing if no view state exists for the original database', () => {
    // Remove the seeded state first
    DatabaseViewStateStore.clear();

    onRenameDatabase({
      original: objectDatabase,
      updated: renamedDatabase,
    });

    // No state should exist for either ID
    expect(DatabaseViewStateStore.get(objectDatabase.id)).toBeNull();
    expect(DatabaseViewStateStore.get(renamedDatabase.id)).toBeNull();
  });
});
