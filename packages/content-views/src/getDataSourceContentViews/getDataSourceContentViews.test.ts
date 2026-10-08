import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import {
  cleanup,
  contentView_board_1,
  contentView_gallery_1,
  contentView_table_1,
  setup,
} from '../test-utils';
import { getDataSourceContentViews } from './getDataSourceContentViews';

const { workspace_2 } = WorkspaceFixtures;

describe('getDataSourceContentViews', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('retrieves the views of the given data source', () => {
    const views = getDataSourceContentViews('database', 'database-1');

    expect(views.map((view) => view.id)).toEqual([
      contentView_gallery_1.id,
      contentView_board_1.id,
      contentView_table_1.id,
    ]);
  });

  it('does not retrieve views of other data source types', () => {
    // The fixture views all use the database data source type
    expect(getDataSourceContentViews('collection', 'database-1')).toEqual([]);
  });

  it('does not retrieve views of other data sources', () => {
    expect(getDataSourceContentViews('database', 'database-other')).toEqual([]);
  });

  it('retrieves the views of the given workspace', () => {
    expect(
      getDataSourceContentViews('database', 'database-1', workspace_2.id),
    ).toEqual([]);
  });
});
