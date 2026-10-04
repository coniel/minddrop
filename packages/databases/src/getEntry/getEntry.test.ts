import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { EntryNotFoundError } from '../errors';
import { cleanup, objectEntry1, setup } from '../test-utils';
import { getEntry } from './getEntry';

const { workspace_2 } = WorkspaceFixtures;

describe('getEntry', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the entry if it exists', () => {
    const entry = getEntry(objectEntry1.id);

    expect(entry).toEqual(objectEntry1);
  });

  it('throws if the entry does not exist and throwOnNotFound is true', () => {
    expect(() => getEntry('non-existent-entry')).toThrow(EntryNotFoundError);
  });

  it('returns null if the entry does not exist and throwOnNotFound is false', () => {
    const entry = getEntry('non-existent-entry', false);

    expect(entry).toBeNull();
  });

  it('retrieves the entry from the given workspace', () => {
    expect(getEntry(objectEntry1.id, false, workspace_2.id)).toBeNull();
  });
});
