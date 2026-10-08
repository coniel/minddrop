import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { EntriesStore } from '../../EntriesStore';
import {
  cleanup,
  objectDatabase,
  objectEntry1,
  setup,
  timestampEntry1,
  urlDatabase,
} from '../../test-utils';
import { resolveEntryMetadataKey } from '../resolveEntryMetadataKey';
import { findEntryByMetadataKey } from './findEntryByMetadataKey';

const { workspace_2 } = WorkspaceFixtures;

describe('findEntryByMetadataKey', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("finds the entry owning a sidecar by the sidecar's key", () => {
    expect(
      findEntryByMetadataKey(
        objectDatabase.id,
        resolveEntryMetadataKey(objectEntry1.path),
      ),
    ).toEqual(objectEntry1);
  });

  it('does not find an entry of another database', () => {
    expect(
      findEntryByMetadataKey(
        urlDatabase.id,
        resolveEntryMetadataKey(timestampEntry1.path),
      ),
    ).toBeNull();
  });

  it("searches the given workspace's entries", () => {
    const metadataKey = resolveEntryMetadataKey(objectEntry1.path);

    // Should not find the active workspace's entry in another one
    expect(
      findEntryByMetadataKey(objectDatabase.id, metadataKey, workspace_2.id),
    ).toBeNull();

    EntriesStore.in(workspace_2.id).set(objectEntry1);

    expect(
      findEntryByMetadataKey(objectDatabase.id, metadataKey, workspace_2.id),
    ).toEqual(objectEntry1);
  });

  it('returns null for a key no entry owns', () => {
    expect(findEntryByMetadataKey(objectDatabase.id, 'Gone')).toBeNull();
  });
});
