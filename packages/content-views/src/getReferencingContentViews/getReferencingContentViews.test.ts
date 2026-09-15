import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { ContentViewsStore } from '../ContentViewsStore';
import {
  cleanup,
  contentView_board_1,
  contentView_gallery_1,
  setup,
} from '../test-utils';
import { getReferencingContentViews } from './getReferencingContentViews';

const { workspace_2 } = WorkspaceFixtures;

describe('getReferencingContentViews', () => {
  beforeEach(() => {
    setup({});

    // Index references onto a couple of fixture views
    ContentViewsStore.update(contentView_board_1.id, {
      references: ['database-entry_one', 'database-entry_two'],
    });
    ContentViewsStore.update(contentView_gallery_1.id, {
      references: ['database-entry_three'],
    });
  });

  afterEach(cleanup);

  it('retrieves views referencing the given item IDs', () => {
    const views = getReferencingContentViews([
      'database-entry_two',
      'database-entry_three',
    ]);

    expect(views.map((view) => view.id).sort()).toEqual([
      contentView_board_1.id,
      contentView_gallery_1.id,
    ]);
  });

  it('does not retrieve views without matching references', () => {
    expect(getReferencingContentViews(['database-entry_other'])).toEqual([]);
  });

  it('retrieves the views of the given workspace', () => {
    expect(
      getReferencingContentViews(['database-entry_two'], workspace_2.id),
    ).toEqual([]);
  });
});
