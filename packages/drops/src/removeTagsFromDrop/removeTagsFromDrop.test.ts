import { removeTagsFromDrop } from './removeTagsFromDrop';
import { addTagsToDrop } from '../addTagsToDrop';
import { cleanup, core, setup, drop1 } from '../test-utils';
import { TAGS_TEST_DATA } from '@minddrop/tags';
import { DropsResource } from '../DropsResource';

const { tag1, tag2 } = TAGS_TEST_DATA;

describe('removeTagsFromDrop', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('removes tags from the drop', () => {
    // Add tags to a drop
    addTagsToDrop(core, drop1.id, [tag1.id, tag2.id]);

    // Remove one of the tags from the drop
    removeTagsFromDrop(core, drop1.id, [tag1.id]);

    // Get the updated drop
    const drop = DropsResource.get(drop1.id);

    // Drop should no longer contain the removed tag ID
    expect(drop.tags).toEqual([tag2.id]);
  });
});
