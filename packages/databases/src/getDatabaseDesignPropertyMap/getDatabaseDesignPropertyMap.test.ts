import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseNotFoundError } from '../errors';
import { cleanup, objectDatabase, setup } from '../test-utils';
import { updateDatabase } from '../updateDatabase';
import { getDatabaseDesignPropertyMap } from './getDatabaseDesignPropertyMap';

describe('getDatabaseDesignPropertyMap', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the database does not exist', () => {
    expect(() => getDatabaseDesignPropertyMap('non-existent-db')).toThrow(
      DatabaseNotFoundError,
    );
  });

  it('returns the empty map for a freshly created database', () => {
    expect(getDatabaseDesignPropertyMap(objectDatabase.id)).toEqual({});
  });

  it('returns the current map after it has been set', async () => {
    const map = { Title: 'Heading', Subtitle: 'Tagline' };

    await updateDatabase(objectDatabase.id, { designPropertyMap: map });

    expect(getDatabaseDesignPropertyMap(objectDatabase.id)).toEqual(map);
  });
});
