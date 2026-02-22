import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseEntrySerializersStore } from '../DatabaseEntrySerializersStore';
import { DatabasesStore } from '../DatabasesStore';
import { coreEntrySerializers } from '../entry-serializers';
import { cleanup, databases, setup } from '../test-utils';
import { initializeDatabases } from './initializeDatabases';

describe('initializeDatabases', () => {
  beforeEach(() =>
    setup({ loadDatabases: false, loadDatabaseEntrySerializers: false }),
  );

  afterEach(cleanup);

  it('loads entry serializers into the store', async () => {
    await initializeDatabases();

    expect(DatabaseEntrySerializersStore.getAll()).toEqual(
      coreEntrySerializers,
    );
  });

  it('loads databases into the store', async () => {
    await initializeDatabases();

    expect(DatabasesStore.getAll()).toEqual(expect.arrayContaining(databases));
  });
});
