import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  cleanup,
  contentView_board_1,
  contentView_board_2,
  contentView_board_3,
  setup,
} from '../test-utils';
import { getContentViewsOfType } from './getContentViewsOfType';

describe('getContentViewsOfType', () => {
  beforeEach(() => {
    setup({});
  });

  afterEach(cleanup);

  it('retrieves views of the given type', () => {
    const views = getContentViewsOfType('board');

    expect(views.map((view) => view.id)).toEqual([
      contentView_board_1.id,
      contentView_board_2.id,
      contentView_board_3.id,
    ]);
  });

  it('does not retrieve views of other types', () => {
    expect(getContentViewsOfType('kanban')).toEqual([]);
  });
});
