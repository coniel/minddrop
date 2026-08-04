import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Paths } from '@minddrop/utils';
import { cleanup, objectDatabase, setup } from '../../test-utils';
import { matchDatabaseReference } from './matchDatabaseReference';

describe('matchDatabaseReference', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('matches an existing database directory name to its database ID', () => {
    expect(
      matchDatabaseReference(
        objectDatabase.path.replace(`${Paths.workspace}/`, ''),
      ),
    ).toEqual({ type: 'database', id: objectDatabase.id });
  });

  it('does not match names that do not resolve to a database', () => {
    expect(matchDatabaseReference('Unknown')).toBeNull();
  });

  it('does not match addresses containing a path separator', () => {
    expect(matchDatabaseReference('Unknown/Entry.md')).toBeNull();
  });
});
