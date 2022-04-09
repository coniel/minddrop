import { getAllTags } from './getAllTags';
import { cleanup, setup } from '../test-utils';
import { TagsStore } from '../TagsStore';

describe('getAllTags', () => {
  beforeAll(setup);

  afterAll(cleanup);

  it('returns all tags', () => {
    // Get all tags
    const allTags = getAllTags();

    // Should return all tags from the store
    expect(allTags).toEqual(TagsStore.getAll());
  });
});
