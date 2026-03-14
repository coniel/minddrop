import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseFixtures } from '@minddrop/databases';
import { DatabaseViewStateStore } from '../../DatabaseViewStateStore';
import { cleanup, setup } from '../../test-utils';
import { onDeleteDatabase } from './database-deleted';

const { objectDatabase } = DatabaseFixtures;

const viewState = {
  databaseId: objectDatabase.id,
  activeViewId: 'view-1',
  configPanelOpen: true,
  configPanelTab: 'properties' as const,
};

describe('onDeleteDatabase', () => {
  beforeEach(() => {
    setup();

    // Seed the store with view state for the database
    DatabaseViewStateStore.set(viewState);
  });

  afterEach(() => {
    DatabaseViewStateStore.clear();
    cleanup();
  });

  it('removes the view state for the deleted database', () => {
    onDeleteDatabase(objectDatabase);

    // View state should be removed
    expect(DatabaseViewStateStore.get(objectDatabase.id)).toBeNull();
  });

  it('does nothing if no view state exists for the database', () => {
    // Remove the seeded state first
    DatabaseViewStateStore.clear();

    // Should not throw
    onDeleteDatabase(objectDatabase);

    expect(DatabaseViewStateStore.get(objectDatabase.id)).toBeNull();
  });
});
