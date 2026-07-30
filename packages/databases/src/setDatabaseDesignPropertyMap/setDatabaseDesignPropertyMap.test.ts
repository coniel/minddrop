import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabasesStore } from '../DatabasesStore';
import { DatabaseNotFoundError } from '../errors';
import { cleanup, objectDatabase, setup } from '../test-utils';
import { updateDatabase } from '../updateDatabase';
import { setDatabaseDesignPropertyMap } from './setDatabaseDesignPropertyMap';

const map = { Title: 'Heading', Subtitle: 'Tagline' };

describe('setDatabaseDesignPropertyMap', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the database does not exist', async () => {
    await expect(() =>
      setDatabaseDesignPropertyMap('non-existent-db', map),
    ).rejects.toThrow(DatabaseNotFoundError);
  });

  it('replaces the existing design property map', async () => {
    // Seed an initial map
    await updateDatabase(objectDatabase.id, {
      designPropertyMap: { Existing: 'Old' },
    });

    await setDatabaseDesignPropertyMap(objectDatabase.id, map);

    expect(DatabasesStore.get(objectDatabase.id)?.designPropertyMap).toEqual(
      map,
    );
  });

  it('returns the updated database', async () => {
    const result = await setDatabaseDesignPropertyMap(objectDatabase.id, map);

    expect(result.designPropertyMap).toEqual(map);
  });
});
