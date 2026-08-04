import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, objectDatabase, objectEntry1, setup } from '../../test-utils';
import { databaseEntryAddress } from '../databaseEntryAddress';
import { matchDatabaseEntryReference } from './matchDatabaseEntryReference';

describe('matchDatabaseEntryReference', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('matches an existing entry address to its entry ID', () => {
    expect(
      matchDatabaseEntryReference(databaseEntryAddress(objectEntry1.path)),
    ).toEqual({ type: 'database-entry', id: objectEntry1.id });
  });

  it('matches a missing entry inside an existing database with a null ID', () => {
    expect(
      matchDatabaseEntryReference(
        databaseEntryAddress(`${objectDatabase.path}/New entry.md`),
      ),
    ).toEqual({ type: 'database-entry', id: null });
  });

  it('does not match addresses outside an existing database', () => {
    expect(matchDatabaseEntryReference('Unknown/Entry.md')).toBeNull();
  });

  it('does not match addresses without a database segment', () => {
    expect(matchDatabaseEntryReference('Entry.md')).toBeNull();
  });
});
