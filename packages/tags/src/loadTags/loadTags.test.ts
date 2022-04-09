import { loadTags } from './loadTags';
import { cleanup, core, tag1, tag2 } from '../test-utils';
import { TagsStore } from '../TagsStore';
import { mapById } from '@minddrop/utils';

describe('loadTags', () => {
  // Clear tags ffrom the store before tests
  beforeEach(cleanup);

  afterEach(cleanup);

  it('loads tags into the tags store', () => {
    // Load tags
    loadTags(core, [tag1, tag2]);

    // Tags should be in the store
    expect(TagsStore.getAll()).toEqual(mapById([tag1, tag2]));
  });

  it('dispatches a `tags:load` event', (done) => {
    // Listen to 'tags:load' events
    core.addEventListener('tags:load', (payload) => {
      // Payload data should be the loaded tags
      expect(payload.data).toEqual([tag1, tag2]);
      done();
    });

    // Load tags
    loadTags(core, [tag1, tag2]);
  });
});
