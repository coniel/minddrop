import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  cleanup,
  collectionDatabase,
  collectionEntry1,
  setup,
} from '../../test-utils';
import { entryAddress } from './entryAddress';

describe('entryAddress', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("qualifies the entry title with its database's name", () => {
    expect(entryAddress(collectionEntry1)).toBe(
      `${collectionDatabase.name}/${collectionEntry1.title}`,
    );
  });

  it('names the entry under a given database', () => {
    const otherDatabase = { ...collectionDatabase, name: 'Renamed' };

    expect(entryAddress(collectionEntry1, otherDatabase)).toBe(
      `Renamed/${collectionEntry1.title}`,
    );
  });

  it("returns null when the entry's database does not exist", () => {
    expect(
      entryAddress({
        ...collectionEntry1,
        database: 'database_missing',
      }),
    ).toBeNull();
  });
});
