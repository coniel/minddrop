import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { CollectionNotFoundError } from '../errors';
import { cleanup, collection_1, setup } from '../test-utils';
import { getCollection } from './getCollection';

const { workspace_2 } = WorkspaceFixtures;

describe('getCollection', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('retrieves a collection by ID', () => {
    const result = getCollection(collection_1.id);

    expect(result).toBe(collection_1);
  });

  it('throws an error if the collection does not exist', () => {
    expect(() => getCollection('missing')).toThrow(CollectionNotFoundError);
  });

  it('does not throw if the collection does not exist and throwOnNotFound is false', () => {
    expect(() => getCollection('missing', false)).not.toThrow(
      CollectionNotFoundError,
    );
  });

  it('retrieves the collection from the given workspace', () => {
    expect(getCollection(collection_1.id, false, workspace_2.id)).toBeNull();
  });
});
