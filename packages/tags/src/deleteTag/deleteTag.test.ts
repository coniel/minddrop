import { initializeCore } from '@minddrop/core';
import { deleteTag } from './deleteTag';
import { cleanup, setup, tag1 } from '../test-utils';
import { TagsStore } from '../TagsStore';

const core = initializeCore({ appId: 'app-id', extensionId: 'tags' });

describe('deleteTag', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('removes the tag from the store', () => {
    // Delete a tag
    deleteTag(core, tag1.id);

    // Tag should no longer be in the store
    expect(TagsStore.get(tag1.id)).toBeUndefined();
  });

  it('returns the deleted tag', () => {
    // Delete a tag
    const tag = deleteTag(core, tag1.id);

    // Should return the deleted tag
    expect(tag).toEqual(tag1);
  });

  it("dispatches a 'tags:delete' event", (done) => {
    // Listen to 'tags:delete' evenets
    core.addEventListener('tags:delete', (payload) => {
      // Payload data should be the deleted tag
      expect(payload.data).toEqual(tag1);
      done();
    });

    // Delete a tag
    deleteTag(core, tag1.id);
  });
});
