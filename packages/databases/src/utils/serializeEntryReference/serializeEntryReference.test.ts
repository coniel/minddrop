import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { cleanup, objectDatabase, objectEntry1, setup } from '../../test-utils';
import { serializeEntryReference } from './serializeEntryReference';

const { workspace_2 } = WorkspaceFixtures;

describe('serializeEntryReference', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("serializes the entry ID into the entry's address", () => {
    expect(serializeEntryReference(objectEntry1.id)).toBe(
      `${objectDatabase.name}/${objectEntry1.title}`,
    );
  });

  it('returns null for IDs that do not resolve', () => {
    expect(serializeEntryReference('database-entry_missing')).toBeNull();
  });

  it('serializes the entry in the given workspace', () => {
    expect(serializeEntryReference(objectEntry1.id, workspace_2.id)).toBeNull();
  });
});
