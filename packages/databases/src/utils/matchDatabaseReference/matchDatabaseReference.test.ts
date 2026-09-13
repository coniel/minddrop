import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { cleanup, objectDatabase, setup } from '../../test-utils';
import { matchDatabaseReference } from './matchDatabaseReference';

const { workspace_2 } = WorkspaceFixtures;

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

  it('matches against the given workspace', () => {
    expect(
      matchDatabaseReference(objectDatabase.name, workspace_2.id),
    ).toBeNull();
  });
});
