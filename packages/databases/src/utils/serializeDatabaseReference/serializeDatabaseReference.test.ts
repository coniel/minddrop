import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { cleanup, objectDatabase, setup } from '../../test-utils';
import { serializeDatabaseReference } from './serializeDatabaseReference';

const { workspace_2 } = WorkspaceFixtures;

describe('serializeDatabaseReference', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("serializes the database ID into the database's name", () => {
    expect(serializeDatabaseReference(objectDatabase.id)).toBe(
      objectDatabase.name,
    );
  });

  it('returns null for IDs that do not resolve', () => {
    expect(serializeDatabaseReference('database_missing')).toBeNull();
  });

  it('serializes the database in the given workspace', () => {
    expect(
      serializeDatabaseReference(objectDatabase.id, workspace_2.id),
    ).toBeNull();
  });
});
