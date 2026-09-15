import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ContentViewsStore } from '../ContentViewsStore';
import {
  cleanup,
  contentView_board_1,
  contentView_gallery_1,
  setup,
} from '../test-utils';
import { getOwnedContentViews } from './getOwnedContentViews';

describe('getOwnedContentViews', () => {
  beforeEach(() => {
    setup({});

    // Assign owners to a couple of fixture views
    ContentViewsStore.update(contentView_board_1.id, {
      owner: 'database_one',
    });
    ContentViewsStore.update(contentView_gallery_1.id, {
      owner: 'database_two',
    });
  });

  afterEach(cleanup);

  it('retrieves views owned by the given owner', () => {
    const views = getOwnedContentViews('database_one');

    expect(views.map((view) => view.id)).toEqual([contentView_board_1.id]);
  });

  it('does not retrieve views owned by other owners', () => {
    expect(getOwnedContentViews('database_other')).toEqual([]);
  });
});
