import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DataViewsStore } from '../../DataViewsStore';
import { cleanup, dataView_gallery_1, setup } from '../../test-utils';
import { DataView } from '../../types';
import { getRecentDataViews } from './getRecentDataViews';

// Data views with distinct creation dates, newer than the ones
// the fixtures carry.
const middleDataView: DataView = {
  ...dataView_gallery_1,
  id: 'data-view_middle',
  created: new Date('2026-02-01T00:00:00.000Z'),
};
const newestDataView: DataView = {
  ...dataView_gallery_1,
  id: 'data-view_newest',
  created: new Date('2026-03-01T00:00:00.000Z'),
};

describe('getRecentDataViews', () => {
  beforeEach(() => {
    setup({ loadViews: true });

    // Load extra data views with distinct creation dates
    DataViewsStore.load([middleDataView, newestDataView]);
  });

  afterEach(cleanup);

  it('sorts the data views by creation date, newest first', () => {
    expect(getRecentDataViews(2)).toEqual([newestDataView, middleDataView]);
  });

  it('returns no more data views than the limit', () => {
    expect(getRecentDataViews(1)).toEqual([newestDataView]);
  });
});
