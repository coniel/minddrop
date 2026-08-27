import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DataViewsStore } from '../DataViewsStore';
import {
  cleanup,
  dataView_board_1,
  dataView_gallery_1,
  setup,
} from '../test-utils';
import { getOwnedDataViews } from './getOwnedDataViews';

describe('getOwnedDataViews', () => {
  beforeEach(() => {
    setup({});

    // Assign owners to a couple of fixture views
    DataViewsStore.update(dataView_board_1.id, {
      owner: 'database_one',
    });
    DataViewsStore.update(dataView_gallery_1.id, {
      owner: 'database_two',
    });
  });

  afterEach(cleanup);

  it('retrieves views owned by the given owner', () => {
    const views = getOwnedDataViews('database_one');

    expect(views.map((view) => view.id)).toEqual([dataView_board_1.id]);
  });

  it('does not retrieve views owned by other owners', () => {
    expect(getOwnedDataViews('database_other')).toEqual([]);
  });
});
