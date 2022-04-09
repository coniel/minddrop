import { initializeCore } from '@minddrop/core';
import { updateTag } from './updateTag';
import { cleanup, setup, tag1 } from '../test-utils';
import { TagsStore } from '../TagsStore';

const core = initializeCore({ appId: 'app-id', extensionId: 'tags' });

describe('updateTag', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the updated tag', () => {
    // Update a tag
    const tag = updateTag(core, tag1.id, { color: 'cyan' });

    // Should return the updated tag
    expect(tag).toEqual({ ...tag1, color: 'cyan' });
  });

  it('updates the tag in the store', () => {
    // Update a tag
    const tag = updateTag(core, tag1.id, { color: 'cyan' });

    // Should update the tag in the store
    expect(TagsStore.get(tag1.id)).toEqual(tag);
  });

  it('dispatches a `tags:update` event', (done) => {
    const changes = { label: 'New label' };

    // Listen to 'tags:update' events
    core.addEventListener('tags:update', (payload) => {
      // Get the updated tag
      const after = TagsStore.get(tag1.id);

      // Payload data should be an update object
      expect(payload.data).toEqual({ before: tag1, after, changes });
      done();
    });

    // Update a tag
    updateTag(core, tag1.id, changes);
  });
});
