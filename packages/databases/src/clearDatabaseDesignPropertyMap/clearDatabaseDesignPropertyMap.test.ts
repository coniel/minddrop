import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabasesStore } from '../DatabasesStore';
import { DatabaseNotFoundError } from '../errors';
import { cleanup, objectDatabase, setup } from '../test-utils';
import { updateDatabase } from '../updateDatabase';
import { clearDatabaseDesignPropertyMap } from './clearDatabaseDesignPropertyMap';

describe('clearDatabaseDesignPropertyMap', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the database does not exist', async () => {
    await expect(() =>
      clearDatabaseDesignPropertyMap('non-existent-db'),
    ).rejects.toThrow(DatabaseNotFoundError);
  });

  it('resets the design property map to an empty map', async () => {
    // Seed a non-empty map
    await updateDatabase(objectDatabase.id, {
      designPropertyMap: { Title: 'Heading' },
    });

    await clearDatabaseDesignPropertyMap(objectDatabase.id);

    expect(DatabasesStore.get(objectDatabase.id)?.designPropertyMap).toEqual(
      {},
    );
  });

  it('returns the updated database', async () => {
    const result = await clearDatabaseDesignPropertyMap(objectDatabase.id);

    expect(result.designPropertyMap).toEqual({});
  });
});
