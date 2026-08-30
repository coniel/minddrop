import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  cleanup,
  dataView_board_1,
  dataView_gallery_1,
  setup,
} from '../test-utils';
import { getDataSourceDataViews } from './getDataSourceDataViews';

describe('getDataSourceDataViews', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('retrieves the views of the given data source', () => {
    const views = getDataSourceDataViews('database', 'database-1');

    expect(views.map((view) => view.id)).toEqual([
      dataView_gallery_1.id,
      dataView_board_1.id,
    ]);
  });

  it('does not retrieve views of other data source types', () => {
    // The fixture views all use the database data source type
    expect(getDataSourceDataViews('collection', 'database-1')).toEqual([]);
  });

  it('does not retrieve views of other data sources', () => {
    expect(getDataSourceDataViews('database', 'database-other')).toEqual([]);
  });
});
