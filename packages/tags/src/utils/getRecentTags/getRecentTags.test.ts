import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TagsStore } from '../../TagsStore';
import { cleanup, setup, tag_1 } from '../../test-utils';
import { Tag } from '../../types';
import { getRecentTags } from './getRecentTags';

// Tags with distinct creation dates, newer than the ones
// the fixtures carry.
const middleTag: Tag = {
  ...tag_1,
  id: 'tag_middle',
  created: new Date('2026-02-01T00:00:00.000Z'),
};
const newestTag: Tag = {
  ...tag_1,
  id: 'tag_newest',
  created: new Date('2026-03-01T00:00:00.000Z'),
};

describe('getRecentTags', () => {
  beforeEach(() => {
    setup();

    // Load extra tags with distinct creation dates
    TagsStore.load([middleTag, newestTag]);
  });

  afterEach(cleanup);

  it('sorts the tags by creation date, newest first', () => {
    expect(getRecentTags(2)).toEqual([newestTag, middleTag]);
  });

  it('returns no more tags than the limit', () => {
    expect(getRecentTags(1)).toEqual([newestTag]);
  });
});
