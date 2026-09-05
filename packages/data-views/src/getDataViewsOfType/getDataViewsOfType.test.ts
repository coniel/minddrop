import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  cleanup,
  dataView_board_1,
  dataView_board_2,
  dataView_board_3,
  setup,
} from '../test-utils';
import { getDataViewsOfType } from './getDataViewsOfType';

describe('getDataViewsOfType', () => {
  beforeEach(() => {
    setup({});
  });

  afterEach(cleanup);

  it('retrieves views of the given type', () => {
    const views = getDataViewsOfType('board');

    expect(views.map((view) => view.id)).toEqual([
      dataView_board_1.id,
      dataView_board_2.id,
      dataView_board_3.id,
    ]);
  });

  it('does not retrieve views of other types', () => {
    expect(getDataViewsOfType('kanban')).toEqual([]);
  });
});
