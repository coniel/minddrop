import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, setup, tag_1, tag_2, tags } from '../../test-utils';
import { searchTags } from './searchTags';

describe('searchTags', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns tags matching the query', () => {
    const result = searchTags(tag_1.name);

    expect(result).toContain(tag_1);
  });

  it('matches all tags sharing the query text', () => {
    const result = searchTags('Tag');

    expect(result).toEqual(tags);
  });

  it('limits the search to the given tag IDs', () => {
    const result = searchTags('Tag', [tag_2.id]);

    expect(result).toEqual([tag_2]);
  });

  it('returns an empty array when nothing matches', () => {
    const result = searchTags('no-such-tag');

    expect(result).toEqual([]);
  });
});
