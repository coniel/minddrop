import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ContentViewsStore } from '../../ContentViewsStore';
import { cleanup, contentView_gallery_1, setup } from '../../test-utils';
import { ContentView } from '../../types';
import { getRecentContentViews } from './getRecentContentViews';

// Content views with distinct creation dates, newer than the ones
// the fixtures carry.
const middleContentView: ContentView = {
  ...contentView_gallery_1,
  id: 'content-view_middle',
  created: new Date('2026-02-01T00:00:00.000Z'),
};
const newestContentView: ContentView = {
  ...contentView_gallery_1,
  id: 'content-view_newest',
  created: new Date('2026-03-01T00:00:00.000Z'),
};

describe('getRecentContentViews', () => {
  beforeEach(() => {
    setup({ loadViews: true });

    // Load extra content views with distinct creation dates
    ContentViewsStore.load([middleContentView, newestContentView]);
  });

  afterEach(cleanup);

  it('sorts the content views by creation date, newest first', () => {
    expect(getRecentContentViews(2)).toEqual([
      newestContentView,
      middleContentView,
    ]);
  });

  it('returns no more content views than the limit', () => {
    expect(getRecentContentViews(1)).toEqual([newestContentView]);
  });
});
