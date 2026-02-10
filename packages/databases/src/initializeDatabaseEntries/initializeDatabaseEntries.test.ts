import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { cleanup, databaseEntries, setup } from '../test-utils';
import { initializeDatabaseEntries } from './initializeDatabaseEntries';

describe.only('initializeDatabaseEntries', () => {
  beforeEach(() => setup({ loadDatabaseEntries: false }));

  afterEach(cleanup);

  it('loads database entries into the store from the file system', async () => {
    await initializeDatabaseEntries();

    expect(DatabaseEntriesStore.getAll()).toEqual(databaseEntries);
  });
});
