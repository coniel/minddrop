import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DataViewsStore } from '../DataViewsStore';
import {
  cleanup,
  dataView_board_1,
  dataView_gallery_1,
  setup,
} from '../test-utils';
import { getReferencingDataViews } from './getReferencingDataViews';

describe('getReferencingDataViews', () => {
  beforeEach(() => {
    setup({});

    // Index references onto a couple of fixture views
    DataViewsStore.update(dataView_board_1.id, {
      references: ['database-entry_one', 'database-entry_two'],
    });
    DataViewsStore.update(dataView_gallery_1.id, {
      references: ['database-entry_three'],
    });
  });

  afterEach(cleanup);

  it('retrieves views referencing the given item IDs', () => {
    const views = getReferencingDataViews([
      'database-entry_two',
      'database-entry_three',
    ]);

    expect(views.map((view) => view.id).sort()).toEqual([
      dataView_board_1.id,
      dataView_gallery_1.id,
    ]);
  });

  it('does not retrieve views without matching references', () => {
    expect(getReferencingDataViews(['database-entry_other'])).toEqual([]);
  });
});
