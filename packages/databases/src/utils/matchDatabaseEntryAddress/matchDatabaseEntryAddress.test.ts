import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, objectDatabase, objectEntry1, setup } from '../../test-utils';
import { matchDatabaseEntryAddress } from './matchDatabaseEntryAddress';

describe('matchDatabaseEntryAddress', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('matches the database and entry named by the address', () => {
    expect(
      matchDatabaseEntryAddress(`${objectDatabase.name}/${objectEntry1.title}`),
    ).toEqual({ database: objectDatabase, entry: objectEntry1 });
  });

  it('matches case-insensitively', () => {
    expect(
      matchDatabaseEntryAddress(
        `${objectDatabase.name.toLowerCase()}/${objectEntry1.title.toLowerCase()}`,
      ),
    ).toEqual({ database: objectDatabase, entry: objectEntry1 });
  });

  it('matches a database holding no entry under the title with a null entry', () => {
    expect(
      matchDatabaseEntryAddress(`${objectDatabase.name}/New entry`),
    ).toEqual({ database: objectDatabase, entry: null });
  });

  it('does not match an entry belonging to another database', () => {
    expect(
      matchDatabaseEntryAddress(`${objectDatabase.name}/Reference Entry 1`),
    ).toEqual({ database: objectDatabase, entry: null });
  });

  it('returns null when the first segment names no database', () => {
    expect(matchDatabaseEntryAddress('Unknown/Entry')).toBeNull();
  });

  it('returns null for addresses that are not two segments', () => {
    expect(matchDatabaseEntryAddress(objectDatabase.name)).toBeNull();
    expect(
      matchDatabaseEntryAddress(
        `${objectDatabase.name}/${objectEntry1.title}/Extra`,
      ),
    ).toBeNull();
  });

  it('returns null for addresses with an empty segment', () => {
    expect(matchDatabaseEntryAddress(`/${objectEntry1.title}`)).toBeNull();
    expect(matchDatabaseEntryAddress(`${objectDatabase.name}/`)).toBeNull();
  });
});
