import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, objectDatabase, setup } from '../../test-utils';
import { matchDatabaseReference } from './matchDatabaseReference';

describe('matchDatabaseReference', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('matches an existing database name to its database ID', () => {
    expect(matchDatabaseReference(objectDatabase.name)).toEqual({
      type: 'database',
      id: objectDatabase.id,
    });
  });

  it('matches case-insensitively', () => {
    expect(matchDatabaseReference(objectDatabase.name.toUpperCase())).toEqual({
      type: 'database',
      id: objectDatabase.id,
    });
  });

  it('does not match names that do not resolve to a database', () => {
    expect(matchDatabaseReference('Unknown')).toBeNull();
  });

  it('does not match addresses containing a path separator', () => {
    expect(matchDatabaseReference('Unknown/Entry')).toBeNull();
  });
});
