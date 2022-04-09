import { cleanup, setup } from '../test-utils';
import { clearTags } from './clearTags';
import { TagsStore } from '../TagsStore';

describe('clearTags', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('clears the tags from the store', () => {
    // Clear the tags
    clearTags();

    // Store should no longer contain any tags
    expect(TagsStore.getAll()).toEqual({});
  });
});
